import React, { useState } from 'react';
import { Equipo, Jugador, Cambio } from '../../types';
import { TeamService } from '../../services/teamService';
import './TeamManagement.css';

interface TeamManagementProps {
  equipos: Equipo[];
  cambios: Cambio[];
  onMakeSubstitution: (equipoId: string, jugadorSaleId: string, jugadorEntraId: string) => void;
  onAddCard: (jugadorId: string, tipo: 'AMARILLA' | 'ROJA') => void;
  minutoActual: number;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({
  equipos,
  cambios,
  onMakeSubstitution,
  onAddCard,
  minutoActual
}) => {
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<Jugador | null>(null);
  const [modoCambio, setModoCambio] = useState<'inicio' | 'sale' | 'entra'>('inicio');
  const [jugadorParaCambio, setJugadorParaCambio] = useState<Jugador | null>(null);

  const equipoAzul = equipos.find(e => e.color === 'AZUL');
  const equipoRojo = equipos.find(e => e.color === 'ROJO');

  const handleEquipoSelect = (equipo: Equipo) => {
    setEquipoSeleccionado(equipo);
    setJugadorSeleccionado(null);
    setModoCambio('inicio');
    setJugadorParaCambio(null);
  };

  const handleJugadorSelect = (jugador: Jugador) => {
    setJugadorSeleccionado(jugador);
  };

  const iniciarCambio = (jugador: Jugador) => {
    if (!jugador.esTitular) {
      alert('Solo se pueden cambiar jugadores titulares');
      return;
    }
    
    if (equipoSeleccionado!.cambiosRealizados >= 5) {
      alert('Máximo de cambios alcanzado (5)');
      return;
    }

    setJugadorParaCambio(jugador);
    setModoCambio('entra');
  };

  const completarCambio = (jugadorEntra: Jugador) => {
    if (!jugadorParaCambio || !equipoSeleccionado) return;

    if (jugadorEntra.esTitular) {
      alert('El jugador que entra debe ser suplente');
      return;
    }

    onMakeSubstitution(equipoSeleccionado.id, jugadorParaCambio.id, jugadorEntra.id);
    
    // Resetear estado
    setModoCambio('inicio');
    setJugadorParaCambio(null);
    setJugadorSeleccionado(null);
  };

  const cancelarCambio = () => {
    setModoCambio('inicio');
    setJugadorParaCambio(null);
  };

  const obtenerTarjetasJugador = (jugadorId: string) => {
    // Esta función debería recibir las tarjetas como prop
    // Por ahora retornamos un array vacío
    return [];
  };

  const renderJugador = (jugador: Jugador) => {
    const tarjetas = obtenerTarjetasJugador(jugador.id);
    const tieneTarjetaAmarilla = tarjetas.some((t: any) => t.tipo === 'AMARILLA' && t.activa);
    const tieneTarjetaRoja = tarjetas.some((t: any) => t.tipo === 'ROJA' && t.activa);

    return (
      <div 
        key={jugador.id}
        className={`jugador-item ${jugador.esTitular ? 'titular' : 'suplente'} ${
          jugadorSeleccionado?.id === jugador.id ? 'seleccionado' : ''
        } ${tieneTarjetaRoja ? 'con-tarjeta-roja' : ''} ${tieneTarjetaAmarilla ? 'con-tarjeta-amarilla' : ''}`}
        onClick={() => handleJugadorSelect(jugador)}
      >
        <div className="jugador-numero">{jugador.numero}</div>
        <div className="jugador-info">
          <div className="jugador-nombre">{jugador.nombre}</div>
          <div className="jugador-posicion">{jugador.posicion}</div>
          {jugador.minutosJugados !== undefined && (
            <div className="jugador-minutos">{jugador.minutosJugados}'</div>
          )}
        </div>
        <div className="jugador-tarjetas">
          {tieneTarjetaAmarilla && <span className="tarjeta-amarilla">🟨</span>}
          {tieneTarjetaRoja && <span className="tarjeta-roja">🟥</span>}
        </div>
        <div className="jugador-acciones">
          {jugador.esTitular && modoCambio === 'inicio' && equipoSeleccionado!.cambiosRealizados < 5 && (
            <button 
              className="btn-cambio"
              onClick={(e) => {
                e.stopPropagation();
                iniciarCambio(jugador);
              }}
            >
              Cambiar
            </button>
          )}
          {!jugador.esTitular && modoCambio === 'entra' && (
            <button 
              className="btn-entra"
              onClick={(e) => {
                e.stopPropagation();
                completarCambio(jugador);
              }}
            >
              Entra
            </button>
          )}
          <button 
            className="btn-tarjeta-amarilla"
            onClick={(e) => {
              e.stopPropagation();
              onAddCard(jugador.id, 'AMARILLA');
            }}
            disabled={tieneTarjetaAmarilla || tieneTarjetaRoja}
          >
            🟨
          </button>
          <button 
            className="btn-tarjeta-roja"
            onClick={(e) => {
              e.stopPropagation();
              onAddCard(jugador.id, 'ROJA');
            }}
            disabled={tieneTarjetaRoja}
          >
            🟥
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="team-management-container">
      <h2>Gestión de Equipos</h2>
      
      {/* Selector de equipos */}
      <div className="team-selector">
        <button 
          className={`btn-equipo ${equipoSeleccionado?.color === 'AZUL' ? 'activo' : ''}`}
          onClick={() => equipoAzul && handleEquipoSelect(equipoAzul)}
        >
          {equipoAzul?.nombre} ({equipoAzul?.cambiosRealizados}/5 cambios)
        </button>
        <button 
          className={`btn-equipo ${equipoSeleccionado?.color === 'ROJO' ? 'activo' : ''}`}
          onClick={() => equipoRojo && handleEquipoSelect(equipoRojo)}
        >
          {equipoRojo?.nombre} ({equipoRojo?.cambiosRealizados}/5 cambios)
        </button>
      </div>

      {equipoSeleccionado && (
        <div className="equipo-detalle">
          <div className="equipo-header">
            <h3>{equipoSeleccionado.nombre}</h3>
            {modoCambio === 'entra' && (
              <div className="cambio-en-proceso">
                <p>Cambio en proceso: {jugadorParaCambio?.nombre} (#{jugadorParaCambio?.numero}) sale</p>
                <p>Selecciona el jugador que entra:</p>
                <button className="btn-cancelar" onClick={cancelarCambio}>
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="jugadores-grid">
            {/* Jugadores titulares */}
            <div className="jugadores-seccion">
              <h4>Titulares</h4>
              <div className="jugadores-lista">
                {TeamService.obtenerJugadoresTitulares(equipoSeleccionado).map(renderJugador)}
              </div>
            </div>

            {/* Jugadores suplentes */}
            <div className="jugadores-seccion">
              <h4>Suplentes</h4>
              <div className="jugadores-lista">
                {TeamService.obtenerJugadoresSuplentes(equipoSeleccionado).map(renderJugador)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historial de cambios */}
      {cambios.length > 0 && (
        <div className="cambios-historial">
          <h4>Cambios Realizados</h4>
          <div className="cambios-lista">
            {cambios.slice(-10).reverse().map(cambio => {
              const equipo = equipos.find(e => e.id === cambio.equipoId);
              const jugadorSale = equipo?.jugadores.find(j => j.id === cambio.jugadorSale);
              const jugadorEntra = equipo?.jugadores.find(j => j.id === cambio.jugadorEntra);
              
              return (
                <div key={cambio.id} className="cambio-item">
                  <span className="cambio-tiempo">{cambio.minuto}'</span>
                  <span className="cambio-equipo">{equipo?.nombre}</span>
                  <span className="cambio-detalle">
                    {jugadorSale?.nombre} (#{jugadorSale?.numero}) → {jugadorEntra?.nombre} (#{jugadorEntra?.numero})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
