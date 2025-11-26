export interface User {
  id: string;
  username: string;
  password: string;
  role: 'principal' | 'hod';
  name: string;
}

export interface Department {
  id: string;
  name: string;
  hodName: string;
  totalStudents: number;
  action: string;
}

export interface StudentData {
  id: string;
  name: string;
  rollNumber: string;
  semester: string;
  [key: string]: string | number;
}

export interface ExcelData {
  headers: string[];
  rows: (string | number)[][];
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}
