import { Puntaje, Equipo } from '../types';

export class ScoringService {
  static readonly PUNTOS_TRY = 5;
  static readonly PUNTOS_CONVERSION = 2;
  static readonly PUNTOS_PENAL = 3;

  static crearPuntaje(
    equipoId: string, 
    tipo: 'TRY' | 'CONVERSION' | 'PENAL', 
    minuto: number, 
    jugadorId?: string
  ): Puntaje {
    const puntos = this.obtenerPuntosPorTipo(tipo);
    
    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      equipoId,
      tipo,
      minuto,
      jugadorId,
      puntos
    };
  }

  static obtenerPuntosPorTipo(tipo: 'TRY' | 'CONVERSION' | 'PENAL'): number {
    switch (tipo) {
      case 'TRY':
        return this.PUNTOS_TRY;
      case 'CONVERSION':
        return this.PUNTOS_CONVERSION;
      case 'PENAL':
        return this.PUNTOS_PENAL;
      default:
        return 0;
    }
  }

  static calcularPuntosEquipo(equipoId: string, puntajes: Puntaje[]): number {
    return puntajes
      .filter(puntaje => puntaje.equipoId === equipoId)
      .reduce((total, puntaje) => total + puntaje.puntos, 0);
  }

  static puedeMarcarConversion(equipoId: string, puntajes: Puntaje[], minutoActual: number): boolean {
    // Buscar si hay un try en los últimos 5 minutos
    const triesRecientes = puntajes
      .filter(p => p.equipoId === equipoId && p.tipo === 'TRY')
      .filter(p => minutoActual - p.minuto <= 5)
      .filter(p => minutoActual - p.minuto >= 0);

    // Verificar que no haya ya una conversión para ese try
    const tieneConversion = triesRecientes.some(tryPuntaje => 
      puntajes.some(p => 
        p.equipoId === equipoId && 
        p.tipo === 'CONVERSION' && 
        p.minuto > tryPuntaje.minuto && 
        p.minuto - tryPuntaje.minuto <= 5
      )
    );

    return triesRecientes.length > 0 && !tieneConversion;
  }

  static obtenerResumenPuntajes(equipoId: string, puntajes: Puntaje[]): {
    tries: number;
    conversiones: number;
    penales: number;
    total: number;
  } {
    const puntajesEquipo = puntajes.filter(p => p.equipoId === equipoId);
    
    return {
      tries: puntajesEquipo.filter(p => p.tipo === 'TRY').length,
      conversiones: puntajesEquipo.filter(p => p.tipo === 'CONVERSION').length,
      penales: puntajesEquipo.filter(p => p.tipo === 'PENAL').length,
      total: puntajesEquipo.reduce((sum, p) => sum + p.puntos, 0)
    };
  }

  static obtenerPuntajesPorMinuto(puntajes: Puntaje[]): { [minuto: number]: Puntaje[] } {
    return puntajes.reduce((acc, puntaje) => {
      if (!acc[puntaje.minuto]) {
        acc[puntaje.minuto] = [];
      }
      acc[puntaje.minuto].push(puntaje);
      return acc;
    }, {} as { [minuto: number]: Puntaje[] });
  }

  static eliminarPuntaje(puntajes: Puntaje[], puntajeId: string): Puntaje[] {
    return puntajes.filter(p => p.id !== puntajeId);
  }

  static actualizarPuntaje(puntajes: Puntaje[], puntajeId: string, datosActualizados: Partial<Puntaje>): Puntaje[] {
    return puntajes.map(p => 
      p.id === puntajeId 
        ? { ...p, ...datosActualizados }
        : p
    );
  }
}
