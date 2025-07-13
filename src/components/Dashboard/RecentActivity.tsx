import React from 'react';
import { Clock, User, BookOpen, Calendar } from 'lucide-react';

interface Activity {
  id: string;
  type: 'grade' | 'attendance' | 'assignment' | 'event';
  title: string;
  description: string;
  time: string;
  user?: string;
}

const RecentActivity: React.FC = () => {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'grade',
      title: 'Calificación registrada',
      description: 'Examen de Matemáticas - Carlos Rodríguez: 85/100',
      time: 'Hace 2 horas',
      user: 'Dr. María González'
    },
    {
      id: '2',
      type: 'attendance',
      title: 'Asistencia marcada',
      description: 'Clase de Historia - 28 estudiantes presentes',
      time: 'Hace 4 horas',
      user: 'Prof. Juan Pérez'
    },
    {
      id: '3',
      type: 'assignment',
      title: 'Tarea asignada',
      description: 'Ensayo sobre la Revolución Francesa',
      time: 'Hace 6 horas',
      user: 'Dr. Ana López'
    },
    {
      id: '4',
      type: 'event',
      title: 'Evento programado',
      description: 'Reunión de padres - 30 de enero',
      time: 'Hace 1 día',
      user: 'Administración'
    }
  ];

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'grade':
        return <BookOpen className="w-4 h-4" />;
      case 'attendance':
        return <User className="w-4 h-4" />;
      case 'assignment':
        return <BookOpen className="w-4 h-4" />;
      case 'event':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getColorClass = (type: Activity['type']) => {
    switch (type) {
      case 'grade':
        return 'bg-blue-100 text-blue-600';
      case 'attendance':
        return 'bg-green-100 text-green-600';
      case 'assignment':
        return 'bg-purple-100 text-purple-600';
      case 'event':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className={`w-8 h-8 rounded-full ${getColorClass(activity.type)} flex items-center justify-center flex-shrink-0`}>
              {getIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">{activity.time}</span>
                {activity.user && (
                  <span className="text-xs text-gray-500">{activity.user}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2 hover:bg-blue-50 rounded-lg transition-colors">
        Ver toda la actividad
      </button>
    </div>
  );
};

export default RecentActivity;