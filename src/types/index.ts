export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  studentId?: string;
  teacherId?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  grade: string;
  section: string;
  phone?: string;
  address?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  teacherId: string;
  subjects: string[];
  phone?: string;
  department: string;
  hireDate: string;
  status: 'active' | 'inactive';
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  description?: string;
  teacherId: string;
  grade: string;
  semester: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  teacherId: string;
  score: number;
  maxScore: number;
  type: 'exam' | 'assignment' | 'quiz' | 'project' | 'participation';
  description: string;
  date: string;
  semester: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  subjectId: string;
  teacherId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  period: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'class' | 'exam' | 'meeting' | 'holiday' | 'event';
  participants?: string[];
  location?: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  city: string;
  icon: string;
}