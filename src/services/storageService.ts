import { Partido } from '../types';

const STORAGE_KEY = 'rugby_partidos';

export class StorageService {
  static guardarPartido(partido: Partido): void {
    try {
      const partidos = this.obtenerPartidos();
      const index = partidos.findIndex(p => p.id === partido.id);
      
      if (index >= 0) {
        partidos[index] = partido;
      } else {
        partidos.push(partido);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(partidos));
    } catch (error) {
      console.error('Error al guardar partido:', error);
    }
  }

  static obtenerPartidos(): Partido[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al obtener partidos:', error);
      return [];
    }
  }

  static obtenerPartido(id: string): Partido | null {
    try {
      const partidos = this.obtenerPartidos();
      return partidos.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Error al obtener partido:', error);
      return null;
    }
  }

  static eliminarPartido(id: string): void {
    try {
      const partidos = this.obtenerPartidos();
      const partidosFiltrados = partidos.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(partidosFiltrados));
    } catch (error) {
      console.error('Error al eliminar partido:', error);
    }
  }

  static limpiarTodosLosPartidos(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error al limpiar partidos:', error);
    }
  }

  static exportarPartidos(): string {
    try {
      const partidos = this.obtenerPartidos();
      return JSON.stringify(partidos, null, 2);
    } catch (error) {
      console.error('Error al exportar partidos:', error);
      return '[]';
    }
  }

  static importarPartidos(data: string): boolean {
    try {
      const partidos = JSON.parse(data);
      if (Array.isArray(partidos)) {
        localStorage.setItem(STORAGE_KEY, data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al importar partidos:', error);
      return false;
    }
  }
}
