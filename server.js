// Con Express Generator: la configuración y las rutas van en app.js y app.listen() en bin/www.
// Aquí está todo en un único fichero.
require('dotenv').config({ quiet: true });
const express = require('express');
const connectDB = require('./db');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const loadSampleData = require('./seed');

const app = express();

// El orden importa: los middlewares se ejecutan en el orden en que se definen.
app.use(logger);           // parte 1: el primero, para registrar TODAS las peticiones (también los 404 y los errores)
app.use(express.json());
// Aquí también se podría servir el frontend: app.use(express.static('public'))

app.use('/owners', require('./routes/owners'));
app.use('/pets', require('./routes/pets'));
app.use('/vets', require('./routes/vets'));
app.use('/appointments', require('./routes/appointments'));

// Rutas desconocidas → 404
app.use((req, res) => {
  res.status(404).json({ error: 'La ruta no existe' });
});

// Middleware de errores (parte 4): después de todas las rutas
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(async ({ inMemory }) => {
    // La base de datos en memoria empieza vacía: cargar los datos de ejemplo
    if (inMemory) {
      try {
        console.log(await loadSampleData());
      } catch (err) {
        console.warn('No se han podido cargar los datos de ejemplo (comprueba los modelos):', err.message);
      }
    }
    app.listen(PORT, () => console.log(`Servidor: http://localhost:${PORT}`));
  })
  .catch(err => { console.error(err); process.exit(1); });
