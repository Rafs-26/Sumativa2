import { User } from '../types';

class AuthService {
  private currentUser: User | null = null;
  private readonly STORAGE_KEY = 'school_auth_user';

  constructor() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.currentUser = JSON.parse(stored);
    }
  }

  async login(email: string, password: string): Promise<User> {
    // Simulación de autenticación
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Usuarios de prueba
    const testUsers: User[] = [
      {
        id: '1',
        name: 'Dr. María González',
        email: 'maria.gonzalez@escuela.edu',
        role: 'teacher',
        teacherId: 'T001',
        avatar: 'https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
      },
      {
        id: '2',
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@estudiante.edu',
        role: 'student',
        studentId: 'S001',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
      },
      {
        id: '3',
        name: 'Administrador Sistema',
        email: 'admin@escuela.edu',
        role: 'admin',
        avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
      }
    ];

    const user = testUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    this.currentUser = user;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    return user;
  }

  async loginWithGoogle(): Promise<User> {
    // Simulación de login con Google
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const googleUser: User = {
      id: 'google_' + Math.random().toString(36).substr(2, 9),
      name: 'Usuario Google',
      email: 'usuario@gmail.com',
      role: 'student',
      studentId: 'G001',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    };

    this.currentUser = googleUser;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(googleUser));
    return googleUser;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }
}

export const authService = new AuthService();