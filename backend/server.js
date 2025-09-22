const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');
const PARTIDOS_FILE = path.join(DATA_DIR, 'partidos.json');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Crear directorio de datos si no existe
fs.ensureDirSync(DATA_DIR);

// Función para leer partidos
const readPartidos = async () => {
  try {
    if (await fs.pathExists(PARTIDOS_FILE)) {
      const data = await fs.readFile(PARTIDOS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error al leer partidos:', error);
    return [];
  }
};

// Función para escribir partidos
const writePartidos = async (partidos) => {
  try {
    await fs.writeFile(PARTIDOS_FILE, JSON.stringify(partidos, null, 2));
    return true;
  } catch (error) {
    console.error('Error al escribir partidos:', error);
    return false;
  }
};

// Rutas de la API

// GET /api/partidos - Obtener todos los partidos
app.get('/api/partidos', async (req, res) => {
  try {
    const partidos = await readPartidos();
    res.json({
      success: true,
      data: partidos,
      count: partidos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener partidos',
      error: error.message
    });
  }
});

// GET /api/partidos/:id - Obtener un partido específico
app.get('/api/partidos/:id', async (req, res) => {
  try {
    const partidos = await readPartidos();
    const partido = partidos.find(p => p.id === req.params.id);
    
    if (!partido) {
      return res.status(404).json({
        success: false,
        message: 'Partido no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: partido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el partido',
      error: error.message
    });
  }
});

// POST /api/partidos - Crear un nuevo partido
app.post('/api/partidos', async (req, res) => {
  try {
    const partidos = await readPartidos();
    const nuevoPartido = {
      id: uuidv4(),
      ...req.body,
      fechaCreacion: new Date().toISOString(),
      fechaModificacion: new Date().toISOString()
    };
    
    partidos.push(nuevoPartido);
    const success = await writePartidos(partidos);
    
    if (success) {
      res.status(201).json({
        success: true,
        data: nuevoPartido,
        message: 'Partido creado exitosamente'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error al guardar el partido'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el partido',
      error: error.message
    });
  }
});

// PUT /api/partidos/:id - Actualizar un partido
app.put('/api/partidos/:id', async (req, res) => {
  try {
    const partidos = await readPartidos();
    const index = partidos.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Partido no encontrado'
      });
    }
    
    partidos[index] = {
      ...partidos[index],
      ...req.body,
      id: req.params.id, // Asegurar que el ID no cambie
      fechaModificacion: new Date().toISOString()
    };
    
    const success = await writePartidos(partidos);
    
    if (success) {
      res.json({
        success: true,
        data: partidos[index],
        message: 'Partido actualizado exitosamente'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el partido'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el partido',
      error: error.message
    });
  }
});

// DELETE /api/partidos/:id - Eliminar un partido
app.delete('/api/partidos/:id', async (req, res) => {
  try {
    const partidos = await readPartidos();
    const index = partidos.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Partido no encontrado'
      });
    }
    
    const partidoEliminado = partidos.splice(index, 1)[0];
    const success = await writePartidos(partidos);
    
    if (success) {
      res.json({
        success: true,
        data: partidoEliminado,
        message: 'Partido eliminado exitosamente'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el partido'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el partido',
      error: error.message
    });
  }
});

// GET /api/estadisticas - Obtener estadísticas generales
app.get('/api/estadisticas', async (req, res) => {
  try {
    const partidos = await readPartidos();
    
    const estadisticas = {
      totalPartidos: partidos.length,
      partidosFinalizados: partidos.filter(p => p.finalizado).length,
      partidosEnProgreso: partidos.filter(p => !p.finalizado).length,
      totalPuntos: partidos.reduce((total, partido) => {
        return total + partido.equipos.reduce((equipoTotal, equipo) => {
          return equipoTotal + equipo.puntos;
        }, 0);
      }, 0),
      totalTries: partidos.reduce((total, partido) => {
        return total + partido.puntajes.filter(p => p.tipo === 'TRY').length;
      }, 0),
      totalTarjetas: partidos.reduce((total, partido) => {
        return total + partido.tarjetas.length;
      }, 0),
      totalCambios: partidos.reduce((total, partido) => {
        return total + partido.cambios.length;
      }, 0)
    };
    
    res.json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

// POST /api/exportar - Exportar todos los partidos
app.post('/api/exportar', async (req, res) => {
  try {
    const partidos = await readPartidos();
    const fecha = new Date().toISOString().split('T')[0];
    
    res.json({
      success: true,
      data: partidos,
      filename: `partidos-rugby-${fecha}.json`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al exportar partidos',
      error: error.message
    });
  }
});

// POST /api/importar - Importar partidos
app.post('/api/importar', async (req, res) => {
  try {
    const { partidos } = req.body;
    
    if (!Array.isArray(partidos)) {
      return res.status(400).json({
        success: false,
        message: 'Los datos deben ser un array de partidos'
      });
    }
    
    // Validar estructura básica de cada partido
    for (const partido of partidos) {
      if (!partido.id || !partido.equipos || !Array.isArray(partido.equipos)) {
        return res.status(400).json({
          success: false,
          message: 'Estructura de partido inválida'
        });
      }
    }
    
    const success = await writePartidos(partidos);
    
    if (success) {
      res.json({
        success: true,
        message: `${partidos.length} partidos importados exitosamente`,
        count: partidos.length
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error al importar partidos'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al importar partidos',
      error: error.message
    });
  }
});

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware para manejar errores
app.use((error, req, res, next) => {
  console.error('Error del servidor:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: error.message
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🏉 Servidor de Rugby iniciado en puerto ${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
  console.log(`❤️  Salud del servidor: http://localhost:${PORT}/api/health`);
});

module.exports = app;
