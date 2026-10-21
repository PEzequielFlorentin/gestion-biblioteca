const express = require('express');
const Loan = require('../models/Loan');
const Book = require('../models/Book');
const { auth, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// POST /api/loans  (usuario autenticado) - solicitar préstamo
router.post('/', auth, async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ mensaje: 'Libro no encontrado' });
    if (book.stock < 1) return res.status(400).json({ mensaje: 'No hay stock disponible' });

    const loan = await Loan.create({ user: req.user.id, book: bookId });
    book.stock -= 1;
    await book.save();

    res.status(201).json({ mensaje: 'Préstamo solicitado', loan });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al solicitar préstamo', error: error.message });
  }
});

// GET /api/loans/mis  (usuario) - sus propios préstamos
router.get('/mis', auth, async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.id })
      .populate('book', 'title')
      .sort({ createdAt: -1 });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener préstamos', error: error.message });
  }
});

// GET /api/loans  (solo admin) - todos los préstamos
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('user', 'name email')
      .populate('book', 'title')
      .sort({ createdAt: -1 });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener préstamos', error: error.message });
  }
});

// PUT /api/loans/:id/devolver  (solo admin) - marcar como devuelto
router.put('/:id/devolver', auth, isAdmin, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
    if (loan.status === 'devuelto') {
      return res.status(400).json({ mensaje: 'Este préstamo ya fue devuelto' });
    }

    loan.status = 'devuelto';
    loan.returnDate = Date.now();
    await loan.save();

    // Devolver stock al libro
    const book = await Book.findById(loan.book);
    if (book) {
      book.stock += 1;
      await book.save();
    }

    res.json({ mensaje: 'Préstamo devuelto', loan });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al devolver préstamo', error: error.message });
  }
});

module.exports = router;