import { Grade, Student, Subject } from '../types';

class GradesService {
  private grades: Grade[] = [
    {
      id: '1',
      studentId: 'S001',
      subjectId: 'SUBJ001',
      teacherId: 'T001',
      score: 85,
      maxScore: 100,
      type: 'exam',
      description: 'Examen Parcial - Matemáticas',
      date: '2024-01-15',
      semester: '2024-1'
    },
    {
      id: '2',
      studentId: 'S001',
      subjectId: 'SUBJ002',
      teacherId: 'T001',
      score: 92,
      maxScore: 100,
      type: 'assignment',
      description: 'Ensayo - Historia Universal',
      date: '2024-01-18',
      semester: '2024-1'
    },
    {
      id: '3',
      studentId: 'S002',
      subjectId: 'SUBJ001',
      teacherId: 'T001',
      score: 78,
      maxScore: 100,
      type: 'quiz',
      description: 'Quiz - Álgebra Lineal',
      date: '2024-01-20',
      semester: '2024-1'
    }
  ];

  async getGradesByStudent(studentId: string): Promise<Grade[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.grades.filter(grade => grade.studentId === studentId);
  }

  async getGradesByTeacher(teacherId: string): Promise<Grade[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.grades.filter(grade => grade.teacherId === teacherId);
  }

  async getGradesBySubject(subjectId: string): Promise<Grade[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.grades.filter(grade => grade.subjectId === subjectId);
  }

  async createGrade(gradeData: Omit<Grade, 'id'>): Promise<Grade> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newGrade: Grade = {
      ...gradeData,
      id: 'grade_' + Math.random().toString(36).substr(2, 9)
    };
    
    this.grades.push(newGrade);
    return newGrade;
  }

  async updateGrade(id: string, gradeData: Partial<Grade>): Promise<Grade> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = this.grades.findIndex(grade => grade.id === id);
    if (index === -1) {
      throw new Error('Calificación no encontrada');
    }
    
    this.grades[index] = { ...this.grades[index], ...gradeData };
    return this.grades[index];
  }

  async deleteGrade(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.grades.findIndex(grade => grade.id === id);
    if (index === -1) {
      throw new Error('Calificación no encontrada');
    }
    
    this.grades.splice(index, 1);
  }

  async getStudentAverage(studentId: string, subjectId?: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let studentGrades = this.grades.filter(grade => grade.studentId === studentId);
    
    if (subjectId) {
      studentGrades = studentGrades.filter(grade => grade.subjectId === subjectId);
    }
    
    if (studentGrades.length === 0) return 0;
    
    const totalWeightedScore = studentGrades.reduce((sum, grade) => {
      return sum + (grade.score / grade.maxScore) * 100;
    }, 0);
    
    return totalWeightedScore / studentGrades.length;
  }

  async getGradeStatistics(): Promise<{
    totalGrades: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    gradeDistribution: { range: string; count: number }[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const totalGrades = this.grades.length;
    const scores = this.grades.map(grade => (grade.score / grade.maxScore) * 100);
    
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    
    const gradeDistribution = [
      { range: '90-100', count: scores.filter(s => s >= 90).length },
      { range: '80-89', count: scores.filter(s => s >= 80 && s < 90).length },
      { range: '70-79', count: scores.filter(s => s >= 70 && s < 80).length },
      { range: '60-69', count: scores.filter(s => s >= 60 && s < 70).length },
      { range: '0-59', count: scores.filter(s => s < 60).length }
    ];
    
    return {
      totalGrades,
      averageScore,
      highestScore,
      lowestScore,
      gradeDistribution
    };
  }
}

export const gradesService = new GradesService();