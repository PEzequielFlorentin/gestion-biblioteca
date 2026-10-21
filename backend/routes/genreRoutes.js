const express = require('express');
const Genre = require('../models/Genre');
const { auth, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener géneros', error: error.message });
  }
});

router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    const genre = await Genre.create({ name });
    res.status(201).json(genre);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear género', error: error.message });
  }
});

router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!genre) return res.status(404).json({ mensaje: 'Género no encontrado' });
    res.json(genre);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar género', error: error.message });
  }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).json({ mensaje: 'Género no encontrado' });
    res.json({ mensaje: 'Género eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar género', error: error.message });
  }
});

module.exports = router;