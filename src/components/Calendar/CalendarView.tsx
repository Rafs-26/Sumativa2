import React, { useState, useEffect } from 'react';
import { Calendar, Plus, MapPin, Clock, Users } from 'lucide-react';
import { CalendarEvent } from '../../types';
import { calendarService } from '../../services/calendarService';

const CalendarView: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchEvents();
    fetchUpcomingEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const eventsData = await calendarService.getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const upcoming = await calendarService.getUpcomingEvents(5);
      setUpcomingEvents(upcoming);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    }
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    const colors = {
      class: 'bg-blue-100 text-blue-800 border-blue-200',
      exam: 'bg-red-100 text-red-800 border-red-200',
      meeting: 'bg-purple-100 text-purple-800 border-purple-200',
      holiday: 'bg-green-100 text-green-800 border-green-200',
      event: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getEventTypeLabel = (type: CalendarEvent['type']) => {
    const labels = {
      class: 'Clase',
      exam: 'Examen',
      meeting: 'Reunión',
      holiday: 'Feriado',
      event: 'Evento'
    };
    return labels[type] || type;
  };

  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'class':
        return '📚';
      case 'exam':
        return '📝';
      case 'meeting':
        return '👥';
      case 'holiday':
        return '🎉';
      case 'event':
        return '📅';
      default:
        return '📅';
    }
  };

  const handleSyncWithGoogle = async () => {
    try {
      await calendarService.importFromGoogleCalendar();
      fetchEvents();
      fetchUpcomingEvents();
    } catch (error) {
      console.error('Error syncing with Google Calendar:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Calendario Académico</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSyncWithGoogle}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Sincronizar Google</span>
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Evento</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`border rounded-lg p-4 ${getEventTypeColor(event.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{getEventIcon(event.type)}</span>
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                          {getEventTypeLabel(event.type)}
                        </span>
                      </div>
                      
                      {event.description && (
                        <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        
                        {event.participants && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{event.participants.length} participantes</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                </div>
              ))}

              {events.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No hay eventos programados</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Próximos Eventos</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg">{getEventIcon(event.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString('es-ES')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.startTime} - {event.endTime}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {upcomingEvents.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No hay eventos próximos</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;