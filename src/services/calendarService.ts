import { CalendarEvent } from '../types';

class CalendarService {
  private events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Examen de Matemáticas',
      description: 'Examen final de Álgebra Lineal',
      date: '2024-01-25',
      startTime: '08:00',
      endTime: '10:00',
      type: 'exam',
      location: 'Aula 101',
      participants: ['T001', 'S001', 'S002']
    },
    {
      id: '2',
      title: 'Reunión de Padres',
      description: 'Reunión trimestral con padres de familia',
      date: '2024-01-30',
      startTime: '15:00',
      endTime: '17:00',
      type: 'meeting',
      location: 'Auditorio Principal'
    },
    {
      id: '3',
      title: 'Día Feriado',
      description: 'Día de la Constitución',
      date: '2024-02-05',
      startTime: '00:00',
      endTime: '23:59',
      type: 'holiday'
    }
  ];

  async getEvents(startDate?: string, endDate?: string): Promise<CalendarEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let filteredEvents = this.events;
    
    if (startDate && endDate) {
      filteredEvents = this.events.filter(event => 
        event.date >= startDate && event.date <= endDate
      );
    }
    
    return filteredEvents.sort((a, b) => a.date.localeCompare(b.date));
  }

  async getEventsByType(type: CalendarEvent['type']): Promise<CalendarEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return this.events.filter(event => event.type === type);
  }

  async createEvent(eventData: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newEvent: CalendarEvent = {
      ...eventData,
      id: 'event_' + Math.random().toString(36).substr(2, 9)
    };
    
    this.events.push(newEvent);
    
    // Simulación de integración con Google Calendar
    await this.syncWithGoogleCalendar(newEvent);
    
    return newEvent;
  }

  async updateEvent(id: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = this.events.findIndex(event => event.id === id);
    if (index === -1) {
      throw new Error('Evento no encontrado');
    }
    
    this.events[index] = { ...this.events[index], ...eventData };
    
    // Simulación de actualización en Google Calendar
    await this.syncWithGoogleCalendar(this.events[index]);
    
    return this.events[index];
  }

  async deleteEvent(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.events.findIndex(event => event.id === id);
    if (index === -1) {
      throw new Error('Evento no encontrado');
    }
    
    this.events.splice(index, 1);
  }

  async getUpcomingEvents(limit: number = 5): Promise<CalendarEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const today = new Date().toISOString().split('T')[0];
    
    return this.events
      .filter(event => event.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, limit);
  }

  private async syncWithGoogleCalendar(event: CalendarEvent): Promise<void> {
    // Simulación de sincronización con Google Calendar API
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Evento sincronizado con Google Calendar:', event.title);
  }

  async importFromGoogleCalendar(): Promise<CalendarEvent[]> {
    // Simulación de importación desde Google Calendar
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const importedEvents: CalendarEvent[] = [
      {
        id: 'google_1',
        title: 'Evento importado de Google',
        description: 'Este evento fue importado desde Google Calendar',
        date: '2024-02-10',
        startTime: '14:00',
        endTime: '15:30',
        type: 'meeting',
        location: 'Virtual'
      }
    ];
    
    this.events.push(...importedEvents);
    return importedEvents;
  }
}

export const calendarService = new CalendarService();