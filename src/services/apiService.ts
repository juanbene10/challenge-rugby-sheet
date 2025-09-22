import { Partido } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

export interface Estadisticas {
  totalPartidos: number;
  partidosFinalizados: number;
  partidosEnProgreso: number;
  totalPuntos: number;
  totalTries: number;
  totalTarjetas: number;
  totalCambios: number;
}

export class ApiService {
  private static async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error en la petición API:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Obtener todos los partidos
  static async obtenerPartidos(): Promise<ApiResponse<Partido[]>> {
    return this.request<Partido[]>('/partidos');
  }

  // Obtener un partido específico
  static async obtenerPartido(id: string): Promise<ApiResponse<Partido>> {
    return this.request<Partido>(`/partidos/${id}`);
  }

  // Crear un nuevo partido
  static async crearPartido(partido: Omit<Partido, 'id'>): Promise<ApiResponse<Partido>> {
    return this.request<Partido>('/partidos', {
      method: 'POST',
      body: JSON.stringify(partido),
    });
  }

  // Actualizar un partido existente
  static async actualizarPartido(id: string, partido: Partial<Partido>): Promise<ApiResponse<Partido>> {
    return this.request<Partido>(`/partidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(partido),
    });
  }

  // Eliminar un partido
  static async eliminarPartido(id: string): Promise<ApiResponse<Partido>> {
    return this.request<Partido>(`/partidos/${id}`, {
      method: 'DELETE',
    });
  }

  // Obtener estadísticas generales
  static async obtenerEstadisticas(): Promise<ApiResponse<Estadisticas>> {
    return this.request<Estadisticas>('/estadisticas');
  }

  // Exportar todos los partidos
  static async exportarPartidos(): Promise<ApiResponse<Partido[]>> {
    return this.request<Partido[]>('/exportar', {
      method: 'POST',
    });
  }

  // Importar partidos
  static async importarPartidos(partidos: Partido[]): Promise<ApiResponse<{ count: number }>> {
    return this.request<{ count: number }>('/importar', {
      method: 'POST',
      body: JSON.stringify({ partidos }),
    });
  }

  // Verificar salud del servidor
  static async verificarSalud(): Promise<ApiResponse<{ timestamp: string; version: string }>> {
    return this.request<{ timestamp: string; version: string }>('/health');
  }

  // Sincronizar partido con el servidor
  static async sincronizarPartido(partido: Partido): Promise<boolean> {
    try {
      // Primero intentar actualizar
      const response = await this.actualizarPartido(partido.id, partido);
      
      if (response.success) {
        return true;
      }
      
      // Si no existe, crear uno nuevo
      const createResponse = await this.crearPartido(partido);
      return createResponse.success;
    } catch (error) {
      console.error('Error al sincronizar partido:', error);
      return false;
    }
  }

  // Obtener partidos con filtros
  static async obtenerPartidosConFiltros(filtros: {
    fechaDesde?: string;
    fechaHasta?: string;
    finalizados?: boolean;
    equipoId?: string;
  }): Promise<ApiResponse<Partido[]>> {
    const queryParams = new URLSearchParams();
    
    if (filtros.fechaDesde) queryParams.append('fechaDesde', filtros.fechaDesde);
    if (filtros.fechaHasta) queryParams.append('fechaHasta', filtros.fechaHasta);
    if (filtros.finalizados !== undefined) queryParams.append('finalizados', filtros.finalizados.toString());
    if (filtros.equipoId) queryParams.append('equipoId', filtros.equipoId);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/partidos?${queryString}` : '/partidos';
    
    return this.request<Partido[]>(endpoint);
  }

  // Backup de datos
  static async crearBackup(): Promise<ApiResponse<{ data: Partido[]; filename: string }>> {
    return this.request<{ data: Partido[]; filename: string }>('/exportar', {
      method: 'POST',
    });
  }

  // Restaurar desde backup
  static async restaurarBackup(partidos: Partido[]): Promise<ApiResponse<{ count: number }>> {
    return this.importarPartidos(partidos);
  }
}
