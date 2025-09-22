import { Tarjeta, Jugador } from '../types';

export class CardService {
  static readonly TIEMPO_TARJETA_AMARILLA = 10 * 60; // 10 minutos en segundos

  static crearTarjeta(
    jugadorId: string, 
    tipo: 'AMARILLA' | 'ROJA', 
    minuto: number
  ): Tarjeta {
    const tarjeta: Tarjeta = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      jugadorId,
      tipo,
      minuto,
      activa: true
    };

    if (tipo === 'AMARILLA') {
      tarjeta.tiempoExpiracion = minuto * 60 + this.TIEMPO_TARJETA_AMARILLA;
    }

    return tarjeta;
  }

  static obtenerTarjetasActivas(tarjetas: Tarjeta[]): Tarjeta[] {
    return tarjetas.filter(tarjeta => tarjeta.activa);
  }

  static obtenerTarjetasPorEquipo(tarjetas: Tarjeta[], equipoId: string, jugadores: Jugador[]): Tarjeta[] {
    const jugadoresEquipo = jugadores.filter(j => j.id.includes(equipoId));
    const idsJugadores = jugadoresEquipo.map(j => j.id);
    
    return tarjetas.filter(tarjeta => idsJugadores.includes(tarjeta.jugadorId));
  }

  static obtenerTarjetasAmarillasActivas(tarjetas: Tarjeta[], tiempoActual: number): Tarjeta[] {
    return tarjetas.filter(tarjeta => 
      tarjeta.tipo === 'AMARILLA' && 
      tarjeta.activa && 
      tarjeta.tiempoExpiracion && 
      tarjeta.tiempoExpiracion > tiempoActual
    );
  }

  static verificarTarjetasExpiradas(tarjetas: Tarjeta[], tiempoActual: number): Tarjeta[] {
    return tarjetas.filter(tarjeta => 
      tarjeta.tipo === 'AMARILLA' && 
      tarjeta.activa && 
      tarjeta.tiempoExpiracion && 
      tarjeta.tiempoExpiracion <= tiempoActual
    );
  }

  static expirarTarjeta(tarjetas: Tarjeta[], tarjetaId: string): Tarjeta[] {
    return tarjetas.map(tarjeta => 
      tarjeta.id === tarjetaId 
        ? { ...tarjeta, activa: false }
        : tarjeta
    );
  }

  static calcularTiempoRestanteTarjeta(tarjeta: Tarjeta, tiempoActual: number): number {
    if (tarjeta.tipo === 'ROJA' || !tarjeta.tiempoExpiracion) {
      return 0;
    }
    
    return Math.max(0, tarjeta.tiempoExpiracion - tiempoActual);
  }

  static formatearTiempoTarjeta(segundos: number): string {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  }

  static puedeAplicarTarjeta(jugador: Jugador, tarjetas: Tarjeta[]): { 
    puede: boolean; 
    razon?: string 
  } {
    const tarjetasJugador = tarjetas.filter(t => t.jugadorId === jugador.id);
    const tarjetasActivas = tarjetasJugador.filter(t => t.activa);

    if (tarjetasActivas.length === 0) {
      return { puede: true };
    }

    const tieneRoja = tarjetasActivas.some(t => t.tipo === 'ROJA');
    if (tieneRoja) {
      return { puede: false, razon: 'El jugador ya tiene tarjeta roja' };
    }

    const tieneAmarilla = tarjetasActivas.some(t => t.tipo === 'AMARILLA');
    if (tieneAmarilla) {
      return { puede: false, razon: 'El jugador ya tiene tarjeta amarilla activa' };
    }

    return { puede: true };
  }

  static eliminarTarjeta(tarjetas: Tarjeta[], tarjetaId: string): Tarjeta[] {
    return tarjetas.filter(t => t.id !== tarjetaId);
  }

  static obtenerResumenTarjetasEquipo(tarjetas: Tarjeta[], equipoId: string, jugadores: Jugador[]): {
    amarillas: number;
    rojas: number;
    total: number;
  } {
    const tarjetasEquipo = this.obtenerTarjetasPorEquipo(tarjetas, equipoId, jugadores);
    const tarjetasActivas = this.obtenerTarjetasActivas(tarjetasEquipo);

    return {
      amarillas: tarjetasActivas.filter(t => t.tipo === 'AMARILLA').length,
      rojas: tarjetasActivas.filter(t => t.tipo === 'ROJA').length,
      total: tarjetasActivas.length
    };
  }
}
