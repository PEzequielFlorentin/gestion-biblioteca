const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const genreRoutes = require('./routes/genreRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error de conexión:', err.message));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/loans', loanRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de gestión de biblioteca funcionando' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});