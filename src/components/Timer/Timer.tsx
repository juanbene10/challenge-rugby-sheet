import React from 'react';
import { TimerService } from '../../services/timerService';
import { Partido } from '../../types';
import './Timer.css';

interface TimerProps {
  partido: Partido;
  onToggleTimer: () => void;
  onNextHalf: () => void;
  onFinishMatch: () => void;
}

export const Timer: React.FC<TimerProps> = ({ partido, onToggleTimer, onNextHalf, onFinishMatch }) => {
  const estadoTiempo = TimerService.obtenerEstadoTiempo(partido.tiempoTranscurrido);
  const tiempoFormateado = TimerService.formatearTiempoPartido(partido.tiempoTranscurrido);
  const tiempoRestanteFormateado = TimerService.formatearTiempo(estadoTiempo.tiempoRestante);

  const getTiempoLabel = () => {
    switch (estadoTiempo.tipo) {
      case 'PRIMER_TIEMPO':
        return '1er Tiempo';
      case 'DESCANSO':
        return 'Descanso';
      case 'SEGUNDO_TIEMPO':
        return '2do Tiempo';
      case 'FINALIZADO':
        return 'Finalizado';
      default:
        return '';
    }
  };

  const getTiempoClass = () => {
    return `timer-container ${estadoTiempo.tipo.toLowerCase()}`;
  };

  return (
    <div className={getTiempoClass()}>
      <div className="timer-header">
        <h2 className="timer-title">{getTiempoLabel()}</h2>
        <div className="timer-status">
          {partido.finalizado ? (
            <span className="status-finalizado">FINALIZADO</span>
          ) : partido.pausado ? (
            <span className="status-pausado">PAUSADO</span>
          ) : (
            <span className="status-activo">EN JUEGO</span>
          )}
        </div>
      </div>

      <div className="timer-display">
        <div className="timer-main">
          <span className="tiempo-actual">{tiempoFormateado}</span>
          {estadoTiempo.tipo !== 'FINALIZADO' && (
            <span className="tiempo-restante">
              {estadoTiempo.tiempoRestante > 0 && `-${tiempoRestanteFormateado}`}
            </span>
          )}
        </div>

        <div className="timer-progress">
          <div 
            className="progress-bar"
            style={{ width: `${estadoTiempo.progreso}%` }}
          />
        </div>
      </div>

      <div className="timer-controls">
        {!partido.finalizado && (
          <button 
            className={`btn-timer ${partido.pausado ? 'btn-play' : 'btn-pause'}`}
            onClick={onToggleTimer}
          >
            {partido.pausado ? '▶️' : '⏸️'}
            {partido.pausado ? 'Iniciar' : 'Pausar'}
          </button>
        )}

        {!partido.finalizado && estadoTiempo.tipo !== 'DESCANSO' && (
          <button 
            className="btn-finish-match"
            onClick={() => {
              if (window.confirm('¿Estás seguro de que quieres finalizar el partido ahora? Esta acción no se puede deshacer.')) {
                onFinishMatch();
              }
            }}
            title="Finalizar partido manualmente"
          >
            🏁 Finalizar Partido
          </button>
        )}

        {estadoTiempo.tipo === 'DESCANSO' && (
          <button 
            className="btn-next-half"
            onClick={onNextHalf}
          >
            Comenzar 2do Tiempo
          </button>
        )}

        {partido.finalizado && (
          <button 
            className="btn-reset"
            onClick={() => window.location.reload()}
          >
            Nuevo Partido
          </button>
        )}
      </div>

      <div className="timer-info">
        <div className="info-item">
          <span className="info-label">Minuto:</span>
          <span className="info-value">{TimerService.calcularMinutoPartido(partido.tiempoTranscurrido)}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Cambios:</span>
          <span className="info-value">
            {partido.equipos.map(e => `${e.cambiosRealizados}/5`).join(' - ')}
          </span>
        </div>
      </div>
    </div>
  );
};
