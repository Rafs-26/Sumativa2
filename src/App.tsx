import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import LoginForm from './components/Auth/LoginForm';
import Dashboard from './components/Dashboard/Dashboard';
import GradesTable from './components/Grades/GradesTable';
import AttendanceTracker from './components/Attendance/AttendanceTracker';
import CalendarView from './components/Calendar/CalendarView';
import WeatherWidget from './components/Weather/WeatherWidget';
import { authService } from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const getTabTitle = (tab: string) => {
    const titles = {
      dashboard: 'Dashboard',
      grades: 'Gestión de Calificaciones',
      attendance: 'Control de Asistencia',
      calendar: 'Calendario Académico',
      subjects: 'Gestión de Materias',
      reports: 'Reportes y Estadísticas',
      weather: 'Información del Clima',
      settings: 'Configuración del Sistema'
    };
    return titles[tab as keyof typeof titles] || 'EduManage';
  };

  const getTabSubtitle = (tab: string) => {
    const subtitles = {
      dashboard: 'Resumen general del sistema educativo',
      grades: 'Registro y seguimiento de calificaciones estudiantiles',
      attendance: 'Monitoreo de asistencia y puntualidad',
      calendar: 'Programación de eventos y actividades académicas',
      subjects: 'Administración de materias y cursos',
      reports: 'Análisis de datos y métricas educativas',
      weather: 'Condiciones climáticas del campus universitario',
      settings: 'Configuración y preferencias del sistema'
    };
    return subtitles[tab as keyof typeof subtitles];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'grades':
        return <GradesTable />;
      case 'attendance':
        return <AttendanceTracker />;
      case 'calendar':
        return <CalendarView />;
      case 'weather':
        return (
          <div className="max-w-2xl">
            <WeatherWidget />
          </div>
        );
      case 'subjects':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Gestión de Materias</h2>
            <p className="text-gray-600">Módulo en desarrollo...</p>
          </div>
        );
      case 'reports':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reportes y Estadísticas</h2>
            <p className="text-gray-600">Módulo en desarrollo...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración</h2>
            <p className="text-gray-600">Módulo en desarrollo...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando EduManage...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={getTabTitle(activeTab)} 
          subtitle={getTabSubtitle(activeTab)}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

export default App;