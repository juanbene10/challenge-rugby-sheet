import React, { useState, useEffect } from 'react';
import { usePartido } from '../hooks/usePartido';
import { Timer } from './Timer/Timer';
import { Scoreboard } from './Scoreboard/Scoreboard';
import { TeamManagement } from './TeamManagement/TeamManagement';
import { StorageService } from '../services/storageService';
import { ApiService } from '../services/apiService';
import { TimerService } from '../services/timerService';
import { PdfService } from '../services/pdfService';
import './App.css';

function App() {
  const {
    partido,
    toggleCronometro,
    agregarPuntaje,
    agregarTarjeta,
    realizarCambio,
    pasarSegundoTiempo,
    finalizarPartido,
    guardarPartido,
    actualizarPartido
  } = usePartido();

  const [partidosGuardados, setPartidosGuardados] = useState<any[]>([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  useEffect(() => {
    // Solicitar permisos de notificación al cargar la app
    TimerService.solicitarPermisoNotificaciones();
    
    // Cargar partidos desde el backend
    const cargarPartidos = async () => {
      try {
        const response = await ApiService.obtenerPartidos();
        if (response.success && response.data) {
          setPartidosGuardados(response.data);
        }
      } catch (error) {
        console.error('Error al cargar partidos desde el backend:', error);
        // Fallback a localStorage solo si el backend falla
        const partidos = StorageService.obtenerPartidos();
        setPartidosGuardados(partidos);
      }
    };
    
    cargarPartidos();
  }, []);

  const minutoActual = TimerService.calcularMinutoPartido(partido.tiempoTranscurrido);

  const handleNuevoPartido = () => {
    if (window.confirm('¿Estás seguro de que quieres crear un nuevo partido? Se perderán los datos no guardados.')) {
      window.location.reload();
    }
  };

  const refrescarHistorial = async () => {
    try {
      const response = await ApiService.obtenerPartidos();
      if (response.success && response.data) {
        setPartidosGuardados(response.data);
      }
    } catch (error) {
      console.error('Error al refrescar historial:', error);
    }
  };

  const handleCargarPartido = async (partidoId: string) => {
    try {
      const response = await ApiService.obtenerPartido(partidoId);
      if (response.success && response.data) {
        actualizarPartido(response.data);
        setMostrarHistorial(false);
      }
    } catch (error) {
      console.error('Error al cargar partido desde el backend:', error);
      // Fallback a localStorage
      const partidoCargado = StorageService.obtenerPartido(partidoId);
      if (partidoCargado) {
        actualizarPartido(partidoCargado);
        setMostrarHistorial(false);
      }
    }
  };


  const handleImportarPartidos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result as string;
        if (StorageService.importarPartidos(data)) {
          const partidos = StorageService.obtenerPartidos();
          setPartidosGuardados(partidos);
          alert('Partidos importados correctamente');
        } else {
          alert('Error al importar los partidos. Verifica el formato del archivo.');
        }
      };
      reader.readAsText(file);
    }
  };



  const renderizarEquiposConColores = (equipos: any[]) => {
    if (!equipos || equipos.length < 2) return <span>Sin equipos</span>;
    
    const equipo1 = equipos[0];
    const equipo2 = equipos[1];
    
    return (
      <span>
        <span className={`equipo-mini ${equipo1?.color?.toLowerCase() || 'azul'}`}>
          {equipo1?.nombre || 'Equipo 1'}: {equipo1?.puntos || 0}
        </span>
        {' vs '}
        <span className={`equipo-mini ${equipo2?.color?.toLowerCase() || 'rojo'}`}>
          {equipo2?.nombre || 'Equipo 2'}: {equipo2?.puntos || 0}
        </span>
      </span>
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏉 Ficha Digital de Partido - Rugby</h1>
        <div className="header-actions">
          <button 
            className="btn-header"
            onClick={() => setMostrarHistorial(!mostrarHistorial)}
          >
            📚 Historial
          </button>
          <button 
            className="btn-header btn-pdf"
            onClick={() => {
              try {
                PdfService.generarReportePartido(partido);
              } catch (error) {
                console.error('Error al generar PDF:', error);
                alert('Error al generar el PDF. Inténtalo de nuevo.');
              }
            }}
            title="Exportar partido actual a PDF"
          >
            📄 Exportar PDF
          </button>
          {!partido.finalizado && (
            <button 
              className="btn-header btn-finish"
              onClick={() => {
                if (window.confirm('¿Estás seguro de que quieres finalizar el partido ahora? Esta acción no se puede deshacer.')) {
                  finalizarPartido();
                }
              }}
              title="Finalizar partido manualmente"
            >
              🏁 Finalizar
            </button>
          )}
          <button 
            className="btn-header"
            onClick={handleNuevoPartido}
          >
            🆕 Nuevo Partido
          </button>
          <button 
            className="btn-header"
            onClick={async () => {
              try {
                await guardarPartido();
                await refrescarHistorial();
                alert('✅ Partido guardado correctamente en el servidor');
              } catch (error) {
                console.error('Error al guardar:', error);
                alert('❌ Error al guardar el partido');
              }
            }}
          >
            💾 Guardar
          </button>
        </div>
      </header>

      <main className="app-main">
        {/* Panel de Historial */}
        {mostrarHistorial && (
          <div className="historial-panel">
            <div className="historial-header">
              <h3>Partidos Guardados</h3>
              <button 
                className="btn-cerrar"
                onClick={() => setMostrarHistorial(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="historial-actions">
              <button 
                className="btn-exportar-pdf"
                onClick={() => {
                  const partidos = StorageService.obtenerPartidos();
                  if (partidos.length > 0) {
                    partidos.forEach((partido, index) => {
                      setTimeout(() => {
                        PdfService.generarReportePartido(partido);
                      }, index * 1000); // Espaciar la generación de PDFs
                    });
                  } else {
                    alert('No hay partidos para exportar');
                  }
                }}
                title="Exportar todos los partidos a PDF"
              >
                📄 Exportar PDFs
              </button>
              <label className="btn-importar">
                📥 Importar
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleImportarPartidos}
                  style={{ display: 'none' }}
                />
              </label>
              <button 
                className="btn-limpiar"
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que quieres eliminar TODOS los partidos guardados? Esta acción no se puede deshacer.')) {
                    StorageService.limpiarTodosLosPartidos();
                    setPartidosGuardados([]);
                    alert('Todos los partidos han sido eliminados');
                  }
                }}
                title="Eliminar todos los partidos guardados"
              >
                🗑️ Limpiar Todo
              </button>
            </div>

            <div className="partidos-lista">
              {partidosGuardados.length === 0 ? (
                <p className="sin-partidos">No hay partidos guardados</p>
              ) : (
                partidosGuardados.map(partidoGuardado => (
                  <div 
                    key={partidoGuardado.id}
                    className="partido-item"
                  >
                    <div 
                      className="partido-info"
                      onClick={() => handleCargarPartido(partidoGuardado.id)}
                    >
                      <div className="partido-fecha">
                        {new Date(partidoGuardado.fecha).toLocaleDateString('es-ES')}
                      </div>
                      <div className="partido-equipos">
                        {renderizarEquiposConColores(partidoGuardado.equipos)}
                      </div>
                      <div className="partido-tiempo">
                        {TimerService.formatearTiempoPartido(partidoGuardado.tiempoTranscurrido)}
                      </div>
                    </div>
                    <div className="partido-actions">
                      <button 
                        className="btn-pdf-individual"
                        onClick={(e) => {
                          e.stopPropagation();
                          PdfService.generarReportePartido(partidoGuardado);
                        }}
                        title="Exportar este partido a PDF"
                      >
                        📄
                      </button>
                      <button 
                        className="btn-pdf-resumen"
                        onClick={(e) => {
                          e.stopPropagation();
                          PdfService.generarReporteResumido(partidoGuardado);
                        }}
                        title="Exportar resumen a PDF"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Componente Principal */}
        <div className="main-content">
          {/* Temporizador */}
          <Timer 
            partido={partido}
            onToggleTimer={toggleCronometro}
            onNextHalf={pasarSegundoTiempo}
            onFinishMatch={finalizarPartido}
          />

          {/* Marcador */}
          <Scoreboard
            equipos={partido.equipos}
            puntajes={partido.puntajes}
            tarjetas={partido.tarjetas}
            onAddScore={agregarPuntaje}
            onAddCard={agregarTarjeta}
            minutoActual={minutoActual}
          />

          {/* Gestión de Equipos */}
          <TeamManagement
            equipos={partido.equipos}
            cambios={partido.cambios}
            onMakeSubstitution={realizarCambio}
            onAddCard={agregarTarjeta}
            minutoActual={minutoActual}
          />
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-info">
          <p>Ficha Digital de Partido - Rugby v1.0</p>
          <p>Desarrollado con React + TypeScript</p>
        </div>
        <div className="footer-stats">
          <span>Partidos guardados: {partidosGuardados.length}</span>
          <span>Estado: {partido.pausado ? 'Pausado' : 'En juego'}</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
