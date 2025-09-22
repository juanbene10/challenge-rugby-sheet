export interface Jugador {
  id: string;
  nombre: string;
  numero: number;
  posicion: string;
  esTitular: boolean;
  minutosJugados?: number;
}

export interface Equipo {
  id: string;
  nombre: string;
  color: 'AZUL' | 'ROJO';
  jugadores: Jugador[];
  puntos: number;
  cambiosRealizados: number;
}

export interface Tarjeta {
  id: string;
  jugadorId: string;
  tipo: 'AMARILLA' | 'ROJA';
  minuto: number;
  tiempoExpiracion?: number; // Para tarjetas amarillas
  activa: boolean;
}

export interface Puntaje {
  id: string;
  equipoId: string;
  tipo: 'TRY' | 'CONVERSION' | 'PENAL';
  minuto: number;
  jugadorId?: string;
  puntos: number;
}

export interface Cambio {
  id: string;
  equipoId: string;
  jugadorSale: string;
  jugadorEntra: string;
  minuto: number;
}

export interface Partido {
  id: string;
  fecha: string;
  equipos: Equipo[];
  tarjetas: Tarjeta[];
  puntajes: Puntaje[];
  cambios: Cambio[];
  tiempoTranscurrido: number; // en segundos
  tiempoActual: number; // en segundos
  primerTiempo: boolean;
  pausado: boolean;
  finalizado: boolean;
}

export interface EstadoPartido {
  partido: Partido;
  temporizadorTarjetas: { [key: string]: number };
}
