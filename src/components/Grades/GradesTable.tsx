import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';
import { Grade } from '../../types';
import { gradesService } from '../../services/gradesService';
import { authService } from '../../services/authService';

const GradesTable: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      setIsLoading(true);
      let gradesData: Grade[] = [];
      
      if (user?.role === 'teacher') {
        gradesData = await gradesService.getGradesByTeacher(user.teacherId!);
      } else if (user?.role === 'student') {
        gradesData = await gradesService.getGradesByStudent(user.studentId!);
      } else {
        // Admin puede ver todas las calificaciones
        gradesData = await gradesService.getGradesByTeacher('T001'); // Ejemplo
      }
      
      setGrades(gradesData);
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || grade.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getGradeColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 80) return 'text-blue-600 bg-blue-50';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTypeLabel = (type: string) => {
    const types = {
      exam: 'Examen',
      assignment: 'Tarea',
      quiz: 'Quiz',
      project: 'Proyecto',
      participation: 'Participación'
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Calificaciones</h2>
          {user?.role === 'teacher' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Calificación</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar calificaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">Todos los tipos</option>
              <option value="exam">Exámenes</option>
              <option value="assignment">Tareas</option>
              <option value="quiz">Quizzes</option>
              <option value="project">Proyectos</option>
              <option value="participation">Participación</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-6 font-medium text-gray-700">Descripción</th>
              <th className="text-left py-3 px-6 font-medium text-gray-700">Tipo</th>
              <th className="text-left py-3 px-6 font-medium text-gray-700">Calificación</th>
              <th className="text-left py-3 px-6 font-medium text-gray-700">Porcentaje</th>
              <th className="text-left py-3 px-6 font-medium text-gray-700">Fecha</th>
              {user?.role === 'teacher' && (
                <th className="text-left py-3 px-6 font-medium text-gray-700">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredGrades.map((grade) => {
              const percentage = (grade.score / grade.maxScore) * 100;
              return (
                <tr key={grade.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{grade.description}</p>
                      <p className="text-sm text-gray-500">Semestre {grade.semester}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {getTypeLabel(grade.type)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900">
                      {grade.score}/{grade.maxScore}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getGradeColor(grade.score, grade.maxScore)}`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(grade.date).toLocaleDateString('es-ES')}
                  </td>
                  {user?.role === 'teacher' && (
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredGrades.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron calificaciones</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradesTable;