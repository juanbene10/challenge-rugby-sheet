import React from 'react';
import { Equipo, Puntaje } from '../../types';
import { ScoringService } from '../../services/scoringService';
import { CardService } from '../../services/cardService';
import './Scoreboard.css';

interface ScoreboardProps {
  equipos: Equipo[];
  puntajes: Puntaje[];
  tarjetas: any[];
  onAddScore: (equipoId: string, tipo: 'TRY' | 'CONVERSION' | 'PENAL', jugadorId?: string) => void;
  onAddCard: (jugadorId: string, tipo: 'AMARILLA' | 'ROJA') => void;
  minutoActual: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  equipos,
  puntajes,
  tarjetas,
  onAddScore,
  onAddCard,
  minutoActual
}) => {
  const equipoAzul = equipos.find(e => e.color === 'AZUL');
  const equipoRojo = equipos.find(e => e.color === 'ROJO');

  if (!equipoAzul || !equipoRojo) {
    return <div>Error: No se encontraron los equipos</div>;
  }

  const puntajesAzul = ScoringService.obtenerResumenPuntajes(equipoAzul.id, puntajes);
  const puntajesRojo = ScoringService.obtenerResumenPuntajes(equipoRojo.id, puntajes);
  const tarjetasAzul = CardService.obtenerResumenTarjetasEquipo(tarjetas, equipoAzul.id, equipoAzul.jugadores);
  const tarjetasRojo = CardService.obtenerResumenTarjetasEquipo(tarjetas, equipoRojo.id, equipoRojo.jugadores);

  const puedeMarcarConversionAzul = ScoringService.puedeMarcarConversion(equipoAzul.id, puntajes, minutoActual);
  const puedeMarcarConversionRojo = ScoringService.puedeMarcarConversion(equipoRojo.id, puntajes, minutoActual);

  return (
    <div className="scoreboard-container">
      <div className="scoreboard-header">
        <h2>Marcador del Partido</h2>
        <div className="minuto-actual">Minuto {minutoActual}</div>
      </div>

      <div className="teams-container">
        {/* Equipo Azul */}
        <div className="team-section team-azul">
          <div className="team-header">
            <h3 className="team-name">{equipoAzul.nombre}</h3>
            <div className="team-score">{puntajesAzul.total}</div>
          </div>

          <div className="score-breakdown">
            <div className="score-item">
              <span className="score-type">Tries:</span>
              <span className="score-value">{puntajesAzul.tries}</span>
            </div>
            <div className="score-item">
              <span className="score-type">Conversiones:</span>
              <span className="score-value">{puntajesAzul.conversiones}</span>
            </div>
            <div className="score-item">
              <span className="score-type">Penales:</span>
              <span className="score-value">{puntajesAzul.penales}</span>
            </div>
          </div>

          <div className="cards-info">
            <div className="card-item amarilla">
              <span>🟨 {tarjetasAzul.amarillas}</span>
            </div>
            <div className="card-item roja">
              <span>🟥 {tarjetasAzul.rojas}</span>
            </div>
          </div>

          <div className="scoring-buttons">
            <button 
              className="btn-score try"
              onClick={() => onAddScore(equipoAzul.id, 'TRY')}
            >
              Try (+5)
            </button>
            <button 
              className="btn-score conversion"
              onClick={() => onAddScore(equipoAzul.id, 'CONVERSION')}
              disabled={!puedeMarcarConversionAzul}
              title={puedeMarcarConversionAzul ? 'Marcar conversión' : 'Necesita un try reciente'}
            >
              Conversión (+2)
            </button>
            <button 
              className="btn-score penal"
              onClick={() => onAddScore(equipoAzul.id, 'PENAL')}
            >
              Penal (+3)
            </button>
          </div>
        </div>

        {/* Separador */}
        <div className="score-separator">
          <div className="vs-text">VS</div>
          <div className="score-total">
            <span className="total-azul">{puntajesAzul.total}</span>
            <span className="separator">-</span>
            <span className="total-rojo">{puntajesRojo.total}</span>
          </div>
        </div>

        {/* Equipo Rojo */}
        <div className="team-section team-rojo">
          <div className="team-header">
            <h3 className="team-name">{equipoRojo.nombre}</h3>
            <div className="team-score">{puntajesRojo.total}</div>
          </div>

          <div className="score-breakdown">
            <div className="score-item">
              <span className="score-type">Tries:</span>
              <span className="score-value">{puntajesRojo.tries}</span>
            </div>
            <div className="score-item">
              <span className="score-type">Conversiones:</span>
              <span className="score-value">{puntajesRojo.conversiones}</span>
            </div>
            <div className="score-item">
              <span className="score-type">Penales:</span>
              <span className="score-value">{puntajesRojo.penales}</span>
            </div>
          </div>

          <div className="cards-info">
            <div className="card-item amarilla">
              <span>🟨 {tarjetasRojo.amarillas}</span>
            </div>
            <div className="card-item roja">
              <span>🟥 {tarjetasRojo.rojas}</span>
            </div>
          </div>

          <div className="scoring-buttons">
            <button 
              className="btn-score try"
              onClick={() => onAddScore(equipoRojo.id, 'TRY')}
            >
              Try (+5)
            </button>
            <button 
              className="btn-score conversion"
              onClick={() => onAddScore(equipoRojo.id, 'CONVERSION')}
              disabled={!puedeMarcarConversionRojo}
              title={puedeMarcarConversionRojo ? 'Marcar conversión' : 'Necesita un try reciente'}
            >
              Conversión (+2)
            </button>
            <button 
              className="btn-score penal"
              onClick={() => onAddScore(equipoRojo.id, 'PENAL')}
            >
              Penal (+3)
            </button>
          </div>
        </div>
      </div>

      {/* Resumen de acciones recientes */}
      <div className="recent-actions">
        <h4>Acciones Recientes</h4>
        <div className="actions-list">
          {puntajes.slice(-5).reverse().map(puntaje => {
            const equipo = equipos.find(e => e.id === puntaje.equipoId);
            return (
              <div key={puntaje.id} className="action-item">
                <span className="action-time">{puntaje.minuto}'</span>
                <span className={`action-team ${equipo?.color.toLowerCase()}`}>
                  {equipo?.nombre}
                </span>
                <span className="action-type">
                  {puntaje.tipo === 'TRY' ? 'Try' : 
                   puntaje.tipo === 'CONVERSION' ? 'Conversión' : 'Penal'}
                </span>
                <span className="action-points">+{puntaje.puntos}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
