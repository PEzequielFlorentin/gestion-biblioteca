const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del género es obligatorio'],
    unique: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Genre', genreSchema);