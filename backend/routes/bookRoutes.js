const express = require('express');
const Book = require('../models/Book');
const { auth, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/books  (público) - lista todos, con populate de author y genre
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().populate('author').populate('genre');
    res.json(books);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener libros', error: error.message });
  }
});

// GET /api/books/:id  (público) - detalle de un libro
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author').populate('genre');
    if (!book) return res.status(404).json({ mensaje: 'Libro no encontrado' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el libro', error: error.message });
  }
});

// POST /api/books  (solo admin)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { title, author, genre, stock, description } = req.body;
    if (!title || !author || !genre) {
      return res.status(400).json({ mensaje: 'Título, autor y género son obligatorios' });
    }
    const book = await Book.create({ title, author, genre, stock, description });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el libro', error: error.message });
  }
});

// PUT /api/books/:id  (solo admin)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!book) return res.status(404).json({ mensaje: 'Libro no encontrado' });
    res.json(book);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el libro', error: error.message });
  }
});

// DELETE /api/books/:id  (solo admin)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ mensaje: 'Libro no encontrado' });
    res.json({ mensaje: 'Libro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el libro', error: error.message });
  }
});

module.exports = router;