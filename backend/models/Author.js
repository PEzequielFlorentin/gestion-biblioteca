const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del autor es obligatorio'],
    trim: true
  },
  nationality: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema);