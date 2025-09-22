export class TimerService {
  static readonly TIEMPO_PRIMER_TIEMPO = 40 * 60; // 40 minutos en segundos
  static readonly TIEMPO_DESCANSO = 15 * 60; // 15 minutos de descanso
  static readonly TIEMPO_TOTAL = 80 * 60; // 80 minutos total

  static calcularMinutoPartido(tiempoTranscurrido: number): number {
    return Math.floor(tiempoTranscurrido / 60) + 1;
  }

  static formatearTiempo(segundos: number): string {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  }

  static formatearTiempoPartido(tiempoTranscurrido: number): string {
    const minuto = this.calcularMinutoPartido(tiempoTranscurrido);
    const tiempoEnMinuto = tiempoTranscurrido % 60;
    
    return `${minuto}' ${tiempoEnMinuto.toString().padStart(2, '0')}"`;
  }

  static obtenerTiempoRestantePrimerTiempo(tiempoTranscurrido: number): number {
    if (tiempoTranscurrido >= this.TIEMPO_PRIMER_TIEMPO) {
      return 0;
    }
    return this.TIEMPO_PRIMER_TIEMPO - tiempoTranscurrido;
  }

  static obtenerTiempoRestanteSegundoTiempo(tiempoTranscurrido: number): number {
    const tiempoSegundoTiempo = tiempoTranscurrido - this.TIEMPO_PRIMER_TIEMPO - this.TIEMPO_DESCANSO;
    
    if (tiempoSegundoTiempo < 0) {
      return this.TIEMPO_PRIMER_TIEMPO;
    }
    
    if (tiempoSegundoTiempo >= this.TIEMPO_PRIMER_TIEMPO) {
      return 0;
    }
    
    return this.TIEMPO_PRIMER_TIEMPO - tiempoSegundoTiempo;
  }

  static esPrimerTiempo(tiempoTranscurrido: number): boolean {
    return tiempoTranscurrido < this.TIEMPO_PRIMER_TIEMPO;
  }

  static esDescanso(tiempoTranscurrido: number): boolean {
    return tiempoTranscurrido >= this.TIEMPO_PRIMER_TIEMPO && 
           tiempoTranscurrido < this.TIEMPO_PRIMER_TIEMPO + this.TIEMPO_DESCANSO;
  }

  static esSegundoTiempo(tiempoTranscurrido: number): boolean {
    return tiempoTranscurrido >= this.TIEMPO_PRIMER_TIEMPO + this.TIEMPO_DESCANSO && 
           tiempoTranscurrido < this.TIEMPO_TOTAL;
  }

  static esPartidoFinalizado(tiempoTranscurrido: number): boolean {
    return tiempoTranscurrido >= this.TIEMPO_TOTAL;
  }

  static obtenerEstadoTiempo(tiempoTranscurrido: number): {
    tipo: 'PRIMER_TIEMPO' | 'DESCANSO' | 'SEGUNDO_TIEMPO' | 'FINALIZADO';
    tiempoRestante: number;
    progreso: number; // 0-100
  } {
    if (this.esPrimerTiempo(tiempoTranscurrido)) {
      return {
        tipo: 'PRIMER_TIEMPO',
        tiempoRestante: this.obtenerTiempoRestantePrimerTiempo(tiempoTranscurrido),
        progreso: (tiempoTranscurrido / this.TIEMPO_PRIMER_TIEMPO) * 100
      };
    }

    if (this.esDescanso(tiempoTranscurrido)) {
      return {
        tipo: 'DESCANSO',
        tiempoRestante: this.TIEMPO_DESCANSO - (tiempoTranscurrido - this.TIEMPO_PRIMER_TIEMPO),
        progreso: 100
      };
    }

    if (this.esSegundoTiempo(tiempoTranscurrido)) {
      const tiempoSegundoTiempo = tiempoTranscurrido - this.TIEMPO_PRIMER_TIEMPO - this.TIEMPO_DESCANSO;
      return {
        tipo: 'SEGUNDO_TIEMPO',
        tiempoRestante: this.obtenerTiempoRestanteSegundoTiempo(tiempoTranscurrido),
        progreso: (tiempoSegundoTiempo / this.TIEMPO_PRIMER_TIEMPO) * 100
      };
    }

    return {
      tipo: 'FINALIZADO',
      tiempoRestante: 0,
      progreso: 100
    };
  }

  static reproducirAlarma(): void {
    // Crear un sonido de alarma simple usando Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('No se pudo reproducir la alarma:', error);
      // Fallback: mostrar notificación del navegador
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('¡Tiempo terminado!', {
          body: 'El tiempo del partido ha finalizado',
          icon: '/favicon.ico'
        });
      }
    }
  }

  static solicitarPermisoNotificaciones(): Promise<boolean> {
    if (!('Notification' in window)) {
      return Promise.resolve(false);
    }

    if (Notification.permission === 'granted') {
      return Promise.resolve(true);
    }

    if (Notification.permission === 'denied') {
      return Promise.resolve(false);
    }

    return Notification.requestPermission().then(permission => permission === 'granted');
  }
}
