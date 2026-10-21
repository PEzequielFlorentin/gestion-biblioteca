const express = require('express');
const Author = require('../models/Author');
const { auth, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener autores', error: error.message });
  }
});

router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { name, nationality } = req.body;
    if (!name) return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    const author = await Author.create({ name, nationality });
    res.status(201).json(author);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear autor', error: error.message });
  }
});

router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!author) return res.status(404).json({ mensaje: 'Autor no encontrado' });
    res.json(author);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar autor', error: error.message });
  }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return res.status(404).json({ mensaje: 'Autor no encontrado' });
    res.json({ mensaje: 'Autor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar autor', error: error.message });
  }
});

module.exports = router;