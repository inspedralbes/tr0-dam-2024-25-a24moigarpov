// server.js
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Sirve archivos estáticos si es necesario

// Ruta para obtener las preguntas
app.get('/api/preguntas', (req, res) => {
  fs.readFile('preguntas.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer el archivo JSON');
    }
    res.json(JSON.parse(data));
  });
});

// Ruta para añadir una pregunta
app.post('/api/preguntas', (req, res) => {
  const newQuestion = req.body;

  fs.readFile('preguntas.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer el archivo JSON');
    }

    const preguntas = JSON.parse(data).preguntes;
    // Genera un nuevo ID (asumiendo que cada pregunta tiene un ID único)
    const newId = preguntas.length > 0 ? Math.max(preguntas.map(q => q.id)) + 1 : 1;
    newQuestion.id = newId; // Asigna un nuevo ID

    preguntas.push(newQuestion);

    fs.writeFile('preguntas.json', JSON.stringify({ preguntes: preguntas }, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error al escribir en el archivo JSON');
      }
      res.status(201).json(newQuestion); // Devuelve la nueva pregunta
    });
  });
});

// Ruta para editar una pregunta
app.put('/api/preguntas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedQuestion = req.body;

  fs.readFile('preguntas.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer el archivo JSON');
    }

    const preguntas = JSON.parse(data).preguntes;
    const index = preguntas.findIndex(q => q.id === id);

    if (index === -1) {
      return res.status(404).send('Pregunta no encontrada');
    }

    preguntas[index] = { ...preguntas[index], ...updatedQuestion };

    fs.writeFile('preguntas.json', JSON.stringify({ preguntes: preguntas }, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error al escribir en el archivo JSON');
      }
      res.status(200).json(preguntas[index]); // Devuelve la pregunta actualizada
    });
  });
});

// Ruta para eliminar una pregunta
app.delete('/api/preguntas/:id', (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile('preguntas.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer el archivo JSON');
    }

    const preguntas = JSON.parse(data).preguntes;

    const updatedPreguntas = preguntas.filter((pregunta) => pregunta.id !== id);

    fs.writeFile('preguntas.json', JSON.stringify({ preguntes: updatedPreguntas }, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error al escribir en el archivo JSON');
      }
      res.status(204).send(); // No content
    });
  });
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
