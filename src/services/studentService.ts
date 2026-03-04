import * as SQLite from 'expo-sqlite';
import { Student } from '../types';

const db = SQLite.openDatabase('motorcycle-school.db');

export const addStudent = async (student: Omit<Student, 'id'>): Promise<Student> => {
  return new Promise((resolve, reject) => {
    const id = Date.now().toString();
    const newStudent: Student = { ...student, id };

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO students (id, name, phone, startDate, completedLessons, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
        [id, student.name, student.phone || '', student.startDate.toISOString(), 0, new Date().toISOString()],
        () => resolve(newStudent),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getAllStudents = async (): Promise<Student[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM students ORDER BY name ASC',
        [],
        (_, result) => {
          const students: Student[] = result.rows._array.map((row: any) => ({
            id: row.id,
            name: row.name,
            phone: row.phone,
            startDate: new Date(row.startDate),
            completedLessons: row.completedLessons,
          }));
          resolve(students);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getStudentById = async (id: string): Promise<Student | null> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM students WHERE id = ?',
        [id],
        (_, result) => {
          if (result.rows.length > 0) {
            const row = result.rows._array[0];
            const student: Student = {
              id: row.id,
              name: row.name,
              phone: row.phone,
              startDate: new Date(row.startDate),
              completedLessons: row.completedLessons,
            };
            resolve(student);
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const deleteStudent = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM students WHERE id = ?',
        [id],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};
