import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Partido, Equipo } from '../types';
import { ScoringService } from './scoringService';
import { TimerService } from './timerService';

// Extender jsPDF para incluir autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export class PdfService {
  static generarReportePartido(partido: Partido): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    // Configurar fuente
    doc.setFont('helvetica');

    // Título principal
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('🏉 FICHA DE PARTIDO - RUGBY', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Información del partido
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const fechaPartido = new Date(partido.fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    doc.text(`Fecha del Partido: ${fechaPartido}`, 20, yPosition);
    doc.text(`ID del Partido: ${partido.id}`, pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 20;

    // Estado del partido
    const estadoPartido = partido.finalizado ? 'FINALIZADO' : 
                         partido.pausado ? 'PAUSADO' : 'EN JUEGO';
    const tiempoFormateado = TimerService.formatearTiempoPartido(partido.tiempoTranscurrido);
    
    // Determinar si fue finalizado manualmente
    const fueFinalizadoManualmente = partido.finalizado && partido.tiempoTranscurrido < TimerService.TIEMPO_TOTAL;
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Estado: ${estadoPartido}`, 20, yPosition);
    if (fueFinalizadoManualmente) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('(Finalizado manualmente)', 70, yPosition);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Tiempo: ${tiempoFormateado}`, pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 15;

    // Marcador final
    const equipoAzul = partido.equipos.find(e => e.color === 'AZUL');
    const equipoRojo = partido.equipos.find(e => e.color === 'ROJO');
    
    if (equipoAzul && equipoRojo) {
      const puntajesAzul = ScoringService.obtenerResumenPuntajes(equipoAzul.id, partido.puntajes);
      const puntajesRojo = ScoringService.obtenerResumenPuntajes(equipoRojo.id, partido.puntajes);

      // Marcador destacado
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(`${equipoAzul.nombre}`, 60, yPosition);
      doc.text(`${puntajesAzul.total}`, 80, yPosition);
      doc.text('VS', pageWidth / 2, yPosition, { align: 'center' });
      doc.text(`${puntajesRojo.total}`, pageWidth - 80, yPosition);
      doc.text(`${equipoRojo.nombre}`, pageWidth - 60, yPosition, { align: 'right' });
      yPosition += 20;

      // Desglose de puntuación por equipos
      this.agregarDesglosePuntuacion(doc, equipoAzul, puntajesAzul, 20, yPosition);
      this.agregarDesglosePuntuacion(doc, equipoRojo, puntajesRojo, pageWidth - 90, yPosition);
      yPosition += 40;
    }

    // Verificar si necesitamos nueva página
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    // Tabla de puntuaciones por minuto
    this.agregarTablaPuntuaciones(doc, partido, yPosition);
    yPosition += 80;

    // Verificar si necesitamos nueva página
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    // Tabla de tarjetas
    this.agregarTablaTarjetas(doc, partido, yPosition);
    yPosition += 60;

    // Verificar si necesitamos nueva página
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    // Tabla de cambios
    this.agregarTablaCambios(doc, partido, yPosition);
    yPosition += 60;

    // Verificar si necesitamos nueva página
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    // Alineaciones de equipos
    this.agregarAlineaciones(doc, partido, yPosition);

    // Pie de página
    this.agregarPiePagina(doc, pageHeight);

    // Descargar el PDF
    const nombreArchivo = `Partido_Rugby_${new Date().toISOString().split('T')[0]}_${partido.id.slice(-8)}.pdf`;
    doc.save(nombreArchivo);
  }

  private static agregarDesglosePuntuacion(
    doc: jsPDF, 
    equipo: Equipo, 
    puntajes: any, 
    x: number, 
    y: number
  ): void {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${equipo.nombre}:`, x, y);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`• Tries: ${puntajes.tries}`, x, y + 8);
    doc.text(`• Conversiones: ${puntajes.conversiones}`, x, y + 16);
    doc.text(`• Penales: ${puntajes.penales}`, x, y + 24);
    doc.text(`• Total: ${puntajes.total} puntos`, x, y + 32);
  }

  private static agregarTablaPuntuaciones(doc: jsPDF, partido: Partido, yStart: number): void {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PUNTUACIONES POR MINUTO', 20, yStart);

    const puntajesOrdenados = [...partido.puntajes].sort((a, b) => a.minuto - b.minuto);
    
    if (puntajesOrdenados.length === 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('No se registraron puntuaciones en este partido.', 20, yStart + 15);
      return;
    }

    const tableData = puntajesOrdenados.map(puntaje => {
      const equipo = partido.equipos.find(e => e.id === puntaje.equipoId);
      const jugador = equipo?.jugadores.find(j => j.id === puntaje.jugadorId);
      
      return [
        `${puntaje.minuto}'`,
        equipo?.nombre || 'N/A',
        this.obtenerTipoPuntaje(puntaje.tipo),
        `${puntaje.puntos} pts`,
        jugador?.nombre || 'N/A'
      ];
    });

    autoTable(doc, {
      startY: yStart + 10,
      head: [['Minuto', 'Equipo', 'Tipo', 'Puntos', 'Jugador']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 }
    });
  }

  private static agregarTablaTarjetas(doc: jsPDF, partido: Partido, yStart: number): void {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TARJETAS DEL PARTIDO', 20, yStart);

    if (partido.tarjetas.length === 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('No se registraron tarjetas en este partido.', 20, yStart + 15);
      return;
    }

    const tableData = partido.tarjetas.map(tarjeta => {
      const equipo = partido.equipos.find(e => e.jugadores.some(j => j.id === tarjeta.jugadorId));
      const jugador = equipo?.jugadores.find(j => j.id === tarjeta.jugadorId);
      
      return [
        `${tarjeta.minuto}'`,
        equipo?.nombre || 'N/A',
        jugador?.nombre || 'N/A',
        `#${jugador?.numero || 'N/A'}`,
        this.obtenerTipoTarjeta(tarjeta.tipo),
        tarjeta.activa ? 'Activa' : 'Expirada'
      ];
    });

    autoTable(doc, {
      startY: yStart + 10,
      head: [['Minuto', 'Equipo', 'Jugador', 'Número', 'Tipo', 'Estado']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [251, 191, 36] },
      alternateRowStyles: { fillColor: [254, 243, 199] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 },
      didParseCell: function(data: any) {
        // Colorear la columna de tipo de tarjeta
        if (data.column.index === 4) { // Columna "Tipo"
          if (data.cell.text[0] === 'Amarilla') {
            data.cell.styles.fillColor = [254, 243, 199]; // Amarillo claro
            data.cell.styles.textColor = [180, 83, 9]; // Amarillo oscuro
          } else if (data.cell.text[0] === 'Roja') {
            data.cell.styles.fillColor = [254, 226, 226]; // Rojo claro
            data.cell.styles.textColor = [153, 27, 27]; // Rojo oscuro
          }
        }
      }
    });
  }

  private static agregarTablaCambios(doc: jsPDF, partido: Partido, yStart: number): void {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CAMBIOS DE JUGADORES', 20, yStart);

    if (partido.cambios.length === 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('No se registraron cambios en este partido.', 20, yStart + 15);
      return;
    }

    const tableData = partido.cambios.map(cambio => {
      const equipo = partido.equipos.find(e => e.id === cambio.equipoId);
      const jugadorSale = equipo?.jugadores.find(j => j.id === cambio.jugadorSale);
      const jugadorEntra = equipo?.jugadores.find(j => j.id === cambio.jugadorEntra);
      
      return [
        `${cambio.minuto}'`,
        equipo?.nombre || 'N/A',
        `${jugadorSale?.nombre} (#${jugadorSale?.numero})`,
        `${jugadorEntra?.nombre} (#${jugadorEntra?.numero})`
      ];
    });

    autoTable(doc, {
      startY: yStart + 10,
      head: [['Minuto', 'Equipo', 'Jugador Sale', 'Jugador Entra']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      alternateRowStyles: { fillColor: [236, 253, 245] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 }
    });
  }

  private static agregarAlineaciones(doc: jsPDF, partido: Partido, yStart: number): void {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ALINEACIONES FINALES', 20, yStart);
    yStart += 15;

    partido.equipos.forEach((equipo, index) => {
      const xPosition = index === 0 ? 20 : doc.internal.pageSize.width / 2 + 10;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${equipo.nombre}`, xPosition, yStart);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const titulares = equipo.jugadores.filter(j => j.esTitular);
      titulares.forEach((jugador, idx) => {
        const yPos = yStart + 15 + (idx * 8);
        doc.text(`${jugador.numero}. ${jugador.nombre} - ${jugador.posicion}`, xPosition, yPos);
      });
      
      if (index === 0) {
        yStart += Math.max(120, titulares.length * 8 + 20);
      }
    });
  }

  private static agregarPiePagina(doc: jsPDF, pageHeight: number): void {
    const fechaGeneracion = new Date().toLocaleString('es-ES');
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Reporte generado el ${fechaGeneracion}`, 20, pageHeight - 20);
    doc.text('Ficha Digital de Partido - Rugby v1.0', doc.internal.pageSize.width - 20, pageHeight - 20, { align: 'right' });
  }

  private static obtenerTipoPuntaje(tipo: string): string {
    switch (tipo) {
      case 'TRY': return 'Try';
      case 'CONVERSION': return 'Conversión';
      case 'PENAL': return 'Penal';
      default: return tipo;
    }
  }

  private static obtenerTipoTarjeta(tipo: string): string {
    switch (tipo) {
      case 'AMARILLA': return 'Amarilla';
      case 'ROJA': return 'Roja';
      default: return tipo;
    }
  }

  // Generar reporte resumido para impresión rápida
  static generarReporteResumido(partido: Partido): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // Título
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('🏉 RESUMEN DEL PARTIDO', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Información básica
    const fechaPartido = new Date(partido.fecha).toLocaleDateString('es-ES');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${fechaPartido}`, 20, yPosition);
    doc.text(`ID: ${partido.id.slice(-8)}`, pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 15;

    // Marcador final
    const equipoAzul = partido.equipos.find(e => e.color === 'AZUL');
    const equipoRojo = partido.equipos.find(e => e.color === 'ROJO');
    
    if (equipoAzul && equipoRojo) {
      const puntajesAzul = ScoringService.obtenerResumenPuntajes(equipoAzul.id, partido.puntajes);
      const puntajesRojo = ScoringService.obtenerResumenPuntajes(equipoRojo.id, partido.puntajes);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`${equipoAzul.nombre}: ${puntajesAzul.total}`, 40, yPosition);
      doc.text('VS', pageWidth / 2, yPosition, { align: 'center' });
      doc.text(`${puntajesRojo.total}: ${equipoRojo.nombre}`, pageWidth - 40, yPosition, { align: 'right' });
      yPosition += 20;

      // Estadísticas básicas
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${puntajesAzul.tries} tries, ${puntajesAzul.conversiones} conversiones, ${puntajesAzul.penales} penales`, 40, yPosition);
      doc.text(`${puntajesRojo.tries} tries, ${puntajesRojo.conversiones} conversiones, ${puntajesRojo.penales} penales`, pageWidth - 40, yPosition, { align: 'right' });
      yPosition += 15;
    }

    // Tiempo total
    const tiempoFormateado = TimerService.formatearTiempoPartido(partido.tiempoTranscurrido);
    const fueFinalizadoManualmente = partido.finalizado && partido.tiempoTranscurrido < TimerService.TIEMPO_TOTAL;
    doc.text(`Tiempo total: ${tiempoFormateado}${fueFinalizadoManualmente ? ' (Finalizado manualmente)' : ''}`, 20, yPosition);
    yPosition += 15;

    // Cambios totales
    const totalCambios = partido.equipos.reduce((sum, equipo) => sum + equipo.cambiosRealizados, 0);
    doc.text(`Cambios realizados: ${totalCambios}`, 20, yPosition);
    yPosition += 15;

    // Tarjetas totales
    const tarjetasAmarillas = partido.tarjetas.filter(t => t.tipo === 'AMARILLA').length;
    const tarjetasRojas = partido.tarjetas.filter(t => t.tipo === 'ROJA').length;
    doc.text(`Tarjetas: ${tarjetasAmarillas} amarillas, ${tarjetasRojas} rojas`, 20, yPosition);

    // Descargar
    const nombreArchivo = `Resumen_Partido_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(nombreArchivo);
  }
}
