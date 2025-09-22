import { Jugador, Equipo } from '../types';

export class TeamService {
  static crearJugador(id: string, nombre: string, numero: number, posicion: string, esTitular: boolean = false): Jugador {
    return {
      id,
      nombre,
      numero,
      posicion,
      esTitular,
      minutosJugados: esTitular ? 0 : undefined
    };
  }

  static crearEquipo(id: string, nombre: string, color: 'AZUL' | 'ROJO'): Equipo {
    const jugadores: Jugador[] = [];
    
    // Crear 15 jugadores titulares
    for (let i = 1; i <= 15; i++) {
      jugadores.push(this.crearJugador(
        `${id}-titular-${i}`,
        `Jugador ${i}`,
        i,
        this.obtenerPosicionPorNumero(i),
        true
      ));
    }
    
    // Crear 10 jugadores suplentes
    for (let i = 16; i <= 25; i++) {
      jugadores.push(this.crearJugador(
        `${id}-suplente-${i}`,
        `Suplente ${i - 15}`,
        i,
        this.obtenerPosicionPorNumero(i),
        false
      ));
    }

    return {
      id,
      nombre,
      color,
      jugadores,
      puntos: 0,
      cambiosRealizados: 0
    };
  }

  static obtenerPosicionPorNumero(numero: number): string {
    const posiciones: { [key: number]: string } = {
      1: 'Pilar',
      2: 'Hooker',
      3: 'Pilar',
      4: 'Segunda línea',
      5: 'Segunda línea',
      6: 'Tercera línea',
      7: 'Tercera línea',
      8: 'Número 8',
      9: 'Medio scrum',
      10: 'Apertura',
      11: 'Ala',
      12: 'Centro',
      13: 'Centro',
      14: 'Ala',
      15: 'Zaguero',
      16: 'Suplente',
      17: 'Suplente',
      18: 'Suplente',
      19: 'Suplente',
      20: 'Suplente',
      21: 'Suplente',
      22: 'Suplente',
      23: 'Suplente',
      24: 'Suplente',
      25: 'Suplente'
    };
    
    return posiciones[numero] || 'Suplente';
  }

  static actualizarJugador(equipo: Equipo, jugadorId: string, datosActualizados: Partial<Jugador>): Equipo {
    const jugadoresActualizados = equipo.jugadores.map(jugador => 
      jugador.id === jugadorId 
        ? { ...jugador, ...datosActualizados }
        : jugador
    );

    return {
      ...equipo,
      jugadores: jugadoresActualizados
    };
  }

  static obtenerJugadoresTitulares(equipo: Equipo): Jugador[] {
    return equipo.jugadores.filter(jugador => jugador.esTitular);
  }

  static obtenerJugadoresSuplentes(equipo: Equipo): Jugador[] {
    return equipo.jugadores.filter(jugador => !jugador.esTitular);
  }

  static obtenerJugadorPorId(equipo: Equipo, jugadorId: string): Jugador | undefined {
    return equipo.jugadores.find(jugador => jugador.id === jugadorId);
  }

  static validarCambio(equipo: Equipo, jugadorSale: Jugador, jugadorEntra: Jugador): { valido: boolean; mensaje?: string } {
    if (equipo.cambiosRealizados >= 5) {
      return { valido: false, mensaje: 'Máximo de cambios alcanzado (5)' };
    }

    if (!jugadorSale.esTitular) {
      return { valido: false, mensaje: 'El jugador que sale debe ser titular' };
    }

    if (jugadorEntra.esTitular) {
      return { valido: false, mensaje: 'El jugador que entra debe ser suplente' };
    }

    return { valido: true };
  }

  static realizarCambio(equipo: Equipo, jugadorSaleId: string, jugadorEntraId: string): Equipo {
    const jugadoresActualizados = equipo.jugadores.map(jugador => {
      if (jugador.id === jugadorSaleId) {
        return { ...jugador, esTitular: false };
      }
      if (jugador.id === jugadorEntraId) {
        return { ...jugador, esTitular: true, minutosJugados: 0 };
      }
      return jugador;
    });

    return {
      ...equipo,
      jugadores: jugadoresActualizados,
      cambiosRealizados: equipo.cambiosRealizados + 1
    };
  }
}
