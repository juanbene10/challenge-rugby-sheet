import { useState, useEffect, useCallback } from 'react';
import { Partido, Equipo, Puntaje, Tarjeta, Cambio, EstadoPartido } from '../types';
import { TeamService } from '../services/teamService';
import { ScoringService } from '../services/scoringService';
import { CardService } from '../services/cardService';
import { TimerService } from '../services/timerService';
import { StorageService } from '../services/storageService';

export const usePartido = (partidoId?: string) => {
  const [estado, setEstado] = useState<EstadoPartido>(() => {
    if (partidoId) {
      const partidoGuardado = StorageService.obtenerPartido(partidoId);
      if (partidoGuardado) {
        return {
          partido: partidoGuardado,
          temporizadorTarjetas: {}
        };
      }
    }

    // Crear nuevo partido
    const equipoAzul = TeamService.crearEquipo('equipo-azul', 'Equipo Azul', 'AZUL');
    const equipoRojo = TeamService.crearEquipo('equipo-rojo', 'Equipo Rojo', 'ROJO');

    const nuevoPartido: Partido = {
      id: partidoId || `partido-${Date.now()}`,
      fecha: new Date().toISOString(),
      equipos: [equipoAzul, equipoRojo],
      tarjetas: [],
      puntajes: [],
      cambios: [],
      tiempoTranscurrido: 0,
      tiempoActual: 0,
      primerTiempo: true,
      pausado: true,
      finalizado: false
    };

    return {
      partido: nuevoPartido,
      temporizadorTarjetas: {}
    };
  });

  const [intervaloId, setIntervaloId] = useState<NodeJS.Timeout | null>(null);

  // Función para actualizar el partido
  const actualizarPartido = useCallback((actualizacion: Partial<Partido>) => {
    setEstado(prev => ({
      ...prev,
      partido: { ...prev.partido, ...actualizacion }
    }));
  }, []);

  // Función para guardar el partido
  const guardarPartido = useCallback(() => {
    StorageService.guardarPartido(estado.partido);
  }, [estado.partido]);

  // Función para iniciar/pausar el cronómetro
  const toggleCronometro = useCallback(() => {
    if (estado.partido.finalizado) return;

    if (intervaloId) {
      clearInterval(intervaloId);
      setIntervaloId(null);
      actualizarPartido({ pausado: true });
    } else {
      const nuevoIntervalo = setInterval(() => {
        setEstado(prev => {
          const nuevoTiempo = prev.partido.tiempoActual + 1;
          const nuevoTiempoTranscurrido = prev.partido.tiempoTranscurrido + 1;
          
          // Verificar si termina el primer tiempo
          if (prev.partido.primerTiempo && nuevoTiempoTranscurrido >= TimerService.TIEMPO_PRIMER_TIEMPO) {
            TimerService.reproducirAlarma();
          }
          
          // Verificar si termina el segundo tiempo
          if (!prev.partido.primerTiempo && nuevoTiempoTranscurrido >= TimerService.TIEMPO_TOTAL) {
            TimerService.reproducirAlarma();
            return {
              ...prev,
              partido: {
                ...prev.partido,
                tiempoActual: nuevoTiempo,
                tiempoTranscurrido: nuevoTiempoTranscurrido,
                finalizado: true
              }
            };
          }

          // Verificar tarjetas amarillas expiradas
          const tarjetasExpiradas = CardService.verificarTarjetasExpiradas(
            prev.partido.tarjetas, 
            nuevoTiempoTranscurrido
          );

          let nuevasTarjetas = prev.partido.tarjetas;
          tarjetasExpiradas.forEach(tarjeta => {
            nuevasTarjetas = CardService.expirarTarjeta(nuevasTarjetas, tarjeta.id);
          });

          return {
            ...prev,
            partido: {
              ...prev.partido,
              tiempoActual: nuevoTiempo,
              tiempoTranscurrido: nuevoTiempoTranscurrido,
              tarjetas: nuevasTarjetas
            }
          };
        });
      }, 1000);
      
      setIntervaloId(nuevoIntervalo);
      actualizarPartido({ pausado: false });
    }
  }, [intervaloId, estado.partido.finalizado, estado.partido.primerTiempo, actualizarPartido]);

  // Función para agregar puntos
  const agregarPuntaje = useCallback((equipoId: string, tipo: 'TRY' | 'CONVERSION' | 'PENAL', jugadorId?: string) => {
    const minuto = TimerService.calcularMinutoPartido(estado.partido.tiempoTranscurrido);
    const nuevoPuntaje = ScoringService.crearPuntaje(equipoId, tipo, minuto, jugadorId);
    
    const nuevosPuntajes = [...estado.partido.puntajes, nuevoPuntaje];
    
    // Actualizar puntos del equipo
    const equiposActualizados = estado.partido.equipos.map(equipo => ({
      ...equipo,
      puntos: ScoringService.calcularPuntosEquipo(equipo.id, nuevosPuntajes)
    }));

    actualizarPartido({
      puntajes: nuevosPuntajes,
      equipos: equiposActualizados
    });
  }, [estado.partido.tiempoTranscurrido, estado.partido.puntajes, estado.partido.equipos, actualizarPartido]);

  // Función para agregar tarjeta
  const agregarTarjeta = useCallback((jugadorId: string, tipo: 'AMARILLA' | 'ROJA') => {
    const minuto = TimerService.calcularMinutoPartido(estado.partido.tiempoTranscurrido);
    const nuevaTarjeta = CardService.crearTarjeta(jugadorId, tipo, minuto);
    
    actualizarPartido({
      tarjetas: [...estado.partido.tarjetas, nuevaTarjeta]
    });
  }, [estado.partido.tiempoTranscurrido, estado.partido.tarjetas, actualizarPartido]);

  // Función para realizar cambio
  const realizarCambio = useCallback((equipoId: string, jugadorSaleId: string, jugadorEntraId: string) => {
    const equipo = estado.partido.equipos.find(e => e.id === equipoId);
    if (!equipo) return;

    const jugadorSale = TeamService.obtenerJugadorPorId(equipo, jugadorSaleId);
    const jugadorEntra = TeamService.obtenerJugadorPorId(equipo, jugadorEntraId);
    
    if (!jugadorSale || !jugadorEntra) return;

    const validacion = TeamService.validarCambio(equipo, jugadorSale, jugadorEntra);
    if (!validacion.valido) {
      alert(validacion.mensaje);
      return;
    }

    const equipoActualizado = TeamService.realizarCambio(equipo, jugadorSaleId, jugadorEntraId);
    
    const minuto = TimerService.calcularMinutoPartido(estado.partido.tiempoTranscurrido);
    const nuevoCambio: Cambio = {
      id: `cambio-${Date.now()}`,
      equipoId,
      jugadorSale: jugadorSaleId,
      jugadorEntra: jugadorEntraId,
      minuto
    };

    const equiposActualizados = estado.partido.equipos.map(e => 
      e.id === equipoId ? equipoActualizado : e
    );

    actualizarPartido({
      equipos: equiposActualizados,
      cambios: [...estado.partido.cambios, nuevoCambio]
    });
  }, [estado.partido.equipos, estado.partido.tiempoTranscurrido, estado.partido.cambios, actualizarPartido]);

  // Función para pasar al segundo tiempo
  const pasarSegundoTiempo = useCallback(() => {
    if (estado.partido.primerTiempo && estado.partido.tiempoTranscurrido >= TimerService.TIEMPO_PRIMER_TIEMPO) {
      actualizarPartido({ 
        primerTiempo: false,
        tiempoActual: 0
      });
    }
  }, [estado.partido.primerTiempo, estado.partido.tiempoTranscurrido, actualizarPartido]);

  // Función para finalizar el partido manualmente
  const finalizarPartido = useCallback(() => {
    if (estado.partido.finalizado) return;

    // Pausar el cronómetro si está corriendo
    if (intervaloId) {
      clearInterval(intervaloId);
      setIntervaloId(null);
    }

    actualizarPartido({ 
      finalizado: true,
      pausado: true
    });

    // Reproducir alarma de finalización
    TimerService.reproducirAlarma();
  }, [estado.partido.finalizado, intervaloId, actualizarPartido]);

  // Función para obtener estadísticas
  const obtenerEstadisticas = useCallback(() => {
    const equipoAzul = estado.partido.equipos.find(e => e.color === 'AZUL');
    const equipoRojo = estado.partido.equipos.find(e => e.color === 'ROJO');

    return {
      equipos: {
        azul: equipoAzul ? ScoringService.obtenerResumenPuntajes(equipoAzul.id, estado.partido.puntajes) : null,
        rojo: equipoRojo ? ScoringService.obtenerResumenPuntajes(equipoRojo.id, estado.partido.puntajes) : null
      },
      tarjetas: {
        azul: equipoAzul ? CardService.obtenerResumenTarjetasEquipo(estado.partido.tarjetas, equipoAzul.id, equipoAzul.jugadores) : null,
        rojo: equipoRojo ? CardService.obtenerResumenTarjetasEquipo(estado.partido.tarjetas, equipoRojo.id, equipoRojo.jugadores) : null
      },
      tiempo: TimerService.obtenerEstadoTiempo(estado.partido.tiempoTranscurrido)
    };
  }, [estado.partido]);

  // Limpiar intervalo al desmontar
  useEffect(() => {
    return () => {
      if (intervaloId) {
        clearInterval(intervaloId);
      }
    };
  }, [intervaloId]);

  // Auto-guardar cada 30 segundos
  useEffect(() => {
    const intervaloGuardado = setInterval(() => {
      guardarPartido();
    }, 30000);

    return () => clearInterval(intervaloGuardado);
  }, [guardarPartido]);

  return {
    partido: estado.partido,
    estadisticas: obtenerEstadisticas(),
    toggleCronometro,
    agregarPuntaje,
    agregarTarjeta,
    realizarCambio,
    pasarSegundoTiempo,
    finalizarPartido,
    guardarPartido,
    actualizarPartido
  };
};
