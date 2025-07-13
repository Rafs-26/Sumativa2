import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Calendar, TrendingUp, GraduationCap, Clock } from 'lucide-react';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import WeatherWidget from '../Weather/WeatherWidget';
import { authService } from '../../services/authService';
import { gradesService } from '../../services/gradesService';
import { attendanceService } from '../../services/attendanceService';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalGrades: 0,
    averageGrade: 0,
    attendanceRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      
      // Simular carga de estadísticas del dashboard
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user?.role === 'teacher') {
        const gradeStats = await gradesService.getGradeStatistics();
        const attendanceStats = await attendanceService.getAttendanceStats();
        
        setStats({
          totalStudents: 45,
          totalGrades: gradeStats.totalGrades,
          averageGrade: gradeStats.averageScore,
          attendanceRate: attendanceStats.attendanceRate
        });
      } else if (user?.role === 'student') {
        const studentGrades = await gradesService.getGradesByStudent(user.studentId!);
        const studentAttendance = await attendanceService.getAttendanceStats(user.studentId);
        
        const average = studentGrades.length > 0 
          ? studentGrades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0) / studentGrades.length
          : 0;
        
        setStats({
          totalStudents: 1,
          totalGrades: studentGrades.length,
          averageGrade: average,
          attendanceRate: studentAttendance.attendanceRate
        });
      } else {
        // Admin stats
        setStats({
          totalStudents: 450,
          totalGrades: 1250,
          averageGrade: 85.7,
          attendanceRate: 92.3
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = 'Buen día';
    
    if (hour < 12) greeting = 'Buenos días';
    else if (hour < 18) greeting = 'Buenas tardes';
    else greeting = 'Buenas noches';
    
    return `${greeting}, ${user?.name}`;
  };

  const getRoleSpecificStats = () => {
    if (user?.role === 'teacher') {
      return [
        {
          title: 'Estudiantes',
          value: stats.totalStudents,
          change: 5,
          changeType: 'increase' as const,
          icon: Users,
          color: 'blue' as const
        },
        {
          title: 'Calificaciones',
          value: stats.totalGrades,
          change: 12,
          changeType: 'increase' as const,
          icon: BookOpen,
          color: 'green' as const
        },
        {
          title: 'Promedio General',
          value: `${stats.averageGrade.toFixed(1)}%`,
          change: 3,
          changeType: 'increase' as const,
          icon: TrendingUp,
          color: 'purple' as const
        },
        {
          title: 'Asistencia',
          value: `${stats.attendanceRate.toFixed(1)}%`,
          change: 2,
          changeType: 'increase' as const,
          icon: Clock,
          color: 'indigo' as const
        }
      ];
    } else if (user?.role === 'student') {
      return [
        {
          title: 'Mi Promedio',
          value: `${stats.averageGrade.toFixed(1)}%`,
          change: 5,
          changeType: 'increase' as const,
          icon: GraduationCap,
          color: 'blue' as const
        },
        {
          title: 'Calificaciones',
          value: stats.totalGrades,
          change: 2,
          changeType: 'increase' as const,
          icon: BookOpen,
          color: 'green' as const
        },
        {
          title: 'Mi Asistencia',
          value: `${stats.attendanceRate.toFixed(1)}%`,
          change: 1,
          changeType: 'increase' as const,
          icon: Clock,
          color: 'purple' as const
        },
        {
          title: 'Materias',
          value: 6,
          icon: Calendar,
          color: 'indigo' as const
        }
      ];
    } else {
      return [
        {
          title: 'Total Estudiantes',
          value: stats.totalStudents,
          change: 8,
          changeType: 'increase' as const,
          icon: Users,
          color: 'blue' as const
        },
        {
          title: 'Total Calificaciones',
          value: stats.totalGrades,
          change: 15,
          changeType: 'increase' as const,
          icon: BookOpen,
          color: 'green' as const
        },
        {
          title: 'Promedio Institucional',
          value: `${stats.averageGrade.toFixed(1)}%`,
          change: 2,
          changeType: 'increase' as const,
          icon: TrendingUp,
          color: 'purple' as const
        },
        {
          title: 'Asistencia General',
          value: `${stats.attendanceRate.toFixed(1)}%`,
          change: 3,
          changeType: 'increase' as const,
          icon: Clock,
          color: 'indigo' as const
        }
      ];
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">{getWelcomeMessage()}</h1>
        <p className="text-blue-100">
          {user?.role === 'teacher' && 'Panel de control para gestión de clases y estudiantes'}
          {user?.role === 'student' && 'Revisa tu progreso académico y calificaciones'}
          {user?.role === 'admin' && 'Panel de administración del sistema educativo'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getRoleSpecificStats().map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Weather Widget */}
        <div>
          <WeatherWidget />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.role === 'teacher' && (
            <>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                <h4 className="font-medium text-gray-900">Agregar Calificación</h4>
                <p className="text-sm text-gray-600">Registrar nuevas calificaciones</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <h4 className="font-medium text-gray-900">Tomar Asistencia</h4>
                <p className="text-sm text-gray-600">Marcar asistencia de estudiantes</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Calendar className="w-8 h-8 text-purple-600 mb-2" />
                <h4 className="font-medium text-gray-900">Programar Evento</h4>
                <p className="text-sm text-gray-600">Crear nuevo evento en calendario</p>
              </button>
            </>
          )}
          
          {user?.role === 'student' && (
            <>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <GraduationCap className="w-8 h-8 text-blue-600 mb-2" />
                <h4 className="font-medium text-gray-900">Ver Calificaciones</h4>
                <p className="text-sm text-gray-600">Revisar calificaciones recientes</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Calendar className="w-8 h-8 text-green-600 mb-2" />
                <h4 className="font-medium text-gray-900">Mi Horario</h4>
                <p className="text-sm text-gray-600">Ver horario de clases</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Clock className="w-8 h-8 text-purple-600 mb-2" />
                <h4 className="font-medium text-gray-900">Mi Asistencia</h4>
                <p className="text-sm text-gray-600">Revisar historial de asistencia</p>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;