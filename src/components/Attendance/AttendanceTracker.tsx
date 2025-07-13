import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Attendance } from '../../types';
import { attendanceService } from '../../services/attendanceService';
import { authService } from '../../services/authService';

const AttendanceTracker: React.FC = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    excusedCount: 0,
    attendanceRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchAttendance();
    fetchStats();
  }, []);

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      let attendanceData: Attendance[] = [];
      
      if (user?.role === 'teacher') {
        attendanceData = await attendanceService.getAttendanceByTeacher(user.teacherId!);
      } else if (user?.role === 'student') {
        attendanceData = await attendanceService.getAttendanceByStudent(user.studentId!);
      }
      
      setAttendance(attendanceData);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await attendanceService.getAttendanceStats(
        user?.role === 'student' ? user.studentId : undefined
      );
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'late':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'excused':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      present: 'Presente',
      absent: 'Ausente',
      late: 'Tardanza',
      excused: 'Justificado'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
      excused: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Clases</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalClasses}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Asistencias</p>
              <p className="text-3xl font-bold text-green-600">{stats.presentCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Faltas</p>
              <p className="text-3xl font-bold text-red-600">{stats.absentCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">% Asistencia</p>
              <p className="text-3xl font-bold text-blue-600">{stats.attendanceRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Registro de Asistencia</h2>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-6 font-medium text-gray-700">Fecha</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Período</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Estado</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Notas</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-900">
                    {new Date(record.date).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {record.period}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(record.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {getStatusLabel(record.status)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {record.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {attendance.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay registros de asistencia</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;