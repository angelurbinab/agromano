require("dotenv").config();
process.emitWarning = () => {};
const express = require("express");
const cors = require("cors");
const session = require('express-session');
const usuarioRoutes = require('./routes/usuarioRoutes');
const titularRoutes = require('./routes/titularRoutes');
const explotacionRoutes = require('./routes/explotacionRoutes');
const animalRoutes = require('./routes/animalRoutes');
const movimientoRoutes = require('./routes/movimientoRoutes');
const incidenciaRoutes = require('./routes/incidenciaRoutes');
const alimentacionRoutes = require('./routes/alimentacionRoutes');
const vacunacionRoutes = require('./routes/vacunacionRoutes');
const vacunacionAnimalRoutes = require('./routes/vacunacionAnimalRoutes');
const inspeccionRoutes = require('./routes/inspeccionRoutes');
const parcelaRoutes = require('./routes/parcelaRoutes');
const medicamentoRoutes = require('./routes/medicamentoRoutes');
const chatbotRoutes = require('./routes/chatbot');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'agromano_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use('/api', usuarioRoutes);
app.use('/api', titularRoutes);
app.use('/api', explotacionRoutes);
app.use('/api', animalRoutes);
app.use('/api', movimientoRoutes);
app.use('/api', incidenciaRoutes);
app.use('/api', alimentacionRoutes);
app.use('/api', medicamentoRoutes);
app.use('/api', vacunacionRoutes);
app.use('/api', vacunacionAnimalRoutes);
app.use('/api', inspeccionRoutes);
app.use('/api', parcelaRoutes);
app.use('/api', authRoutes);
app.use('/api', chatbotRoutes);


// Servidor corriendo
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
