import { Attendance, Student } from '../types';

class AttendanceService {
  private attendanceRecords: Attendance[] = [
    {
      id: '1',
      studentId: 'S001',
      subjectId: 'SUBJ001',
      teacherId: 'T001',
      date: '2024-01-15',
      status: 'present',
      period: '1st Period',
      notes: ''
    },
    {
      id: '2',
      studentId: 'S001',
      subjectId: 'SUBJ002',
      teacherId: 'T001',
      date: '2024-01-15',
      status: 'late',
      period: '2nd Period',
      notes: 'Llegó 10 minutos tarde'
    },
    {
      id: '3',
      studentId: 'S002',
      subjectId: 'SUBJ001',
      teacherId: 'T001',
      date: '2024-01-15',
      status: 'absent',
      period: '1st Period',
      notes: 'Justificación médica presentada'
    }
  ];

  async getAttendanceByStudent(studentId: string, startDate?: string, endDate?: string): Promise<Attendance[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let records = this.attendanceRecords.filter(record => record.studentId === studentId);
    
    if (startDate && endDate) {
      records = records.filter(record => 
        record.date >= startDate && record.date <= endDate
      );
    }
    
    return records;
  }

  async getAttendanceByDate(date: string, subjectId?: string): Promise<Attendance[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let records = this.attendanceRecords.filter(record => record.date === date);
    
    if (subjectId) {
      records = records.filter(record => record.subjectId === subjectId);
    }
    
    return records;
  }

  async getAttendanceByTeacher(teacherId: string): Promise<Attendance[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.attendanceRecords.filter(record => record.teacherId === teacherId);
  }

  async markAttendance(attendanceData: Omit<Attendance, 'id'>): Promise<Attendance> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newRecord: Attendance = {
      ...attendanceData,
      id: 'att_' + Math.random().toString(36).substr(2, 9)
    };
    
    this.attendanceRecords.push(newRecord);
    return newRecord;
  }

  async updateAttendance(id: string, attendanceData: Partial<Attendance>): Promise<Attendance> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = this.attendanceRecords.findIndex(record => record.id === id);
    if (index === -1) {
      throw new Error('Registro de asistencia no encontrado');
    }
    
    this.attendanceRecords[index] = { ...this.attendanceRecords[index], ...attendanceData };
    return this.attendanceRecords[index];
  }

  async getAttendanceStats(studentId?: string, subjectId?: string): Promise<{
    totalClasses: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    excusedCount: number;
    attendanceRate: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let records = this.attendanceRecords;
    
    if (studentId) {
      records = records.filter(record => record.studentId === studentId);
    }
    
    if (subjectId) {
      records = records.filter(record => record.subjectId === subjectId);
    }
    
    const totalClasses = records.length;
    const presentCount = records.filter(r => r.status === 'present').length;
    const absentCount = records.filter(r => r.status === 'absent').length;
    const lateCount = records.filter(r => r.status === 'late').length;
    const excusedCount = records.filter(r => r.status === 'excused').length;
    
    const attendanceRate = totalClasses > 0 ? (presentCount + lateCount) / totalClasses * 100 : 0;
    
    return {
      totalClasses,
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      attendanceRate
    };
  }

  async bulkMarkAttendance(records: Omit<Attendance, 'id'>[]): Promise<Attendance[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newRecords = records.map(record => ({
      ...record,
      id: 'att_' + Math.random().toString(36).substr(2, 9)
    }));
    
    this.attendanceRecords.push(...newRecords);
    return newRecords;
  }
}

export const attendanceService = new AttendanceService();