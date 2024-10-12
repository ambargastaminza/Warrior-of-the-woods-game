const express = require('express');
const app = express();
const port = 3000;

// Define una ruta de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}/`);
});