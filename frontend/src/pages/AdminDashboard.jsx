import { useState, useEffect } from 'react';
import {
  getBooks, createBook, deleteBook,
  getAuthors, createAuthor, deleteAuthor,
  getGenres, createGenre, deleteGenre,
} from '../services/api';
import Loading from '../components/Loading';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [bookForm, setBookForm] = useState({ title: '', author: '', genre: '', stock: 1, description: '' });
  const [authorForm, setAuthorForm] = useState({ name: '', nationality: '' });
  const [genreForm, setGenreForm] = useState({ name: '' });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [b, a, g] = await Promise.all([
        getBooks(), getAuthors(), getGenres(),
      ]);
      setBooks(b); setAuthors(a); setGenres(g);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const handleCreateBook = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!bookForm.title || !bookForm.author || !bookForm.genre) {
      setError('Título, autor y género son obligatorios');
      return;
    }
    try {
      await createBook(bookForm);
      setSuccess('Libro creado');
      setBookForm({ title: '', author: '', genre: '', stock: 1, description: '' });
      loadAll();
    } catch (err) { setError(err.message); }
  };

  const handleCreateAuthor = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!authorForm.name) { setError('El nombre es obligatorio'); return; }
    try {
      await createAuthor(authorForm);
      setSuccess('Autor creado');
      setAuthorForm({ name: '', nationality: '' });
      loadAll();
    } catch (err) { setError(err.message); }
  };

  const handleCreateGenre = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!genreForm.name) { setError('El nombre es obligatorio'); return; }
    try {
      await createGenre(genreForm);
      setSuccess('Género creado');
      setGenreForm({ name: '' });
      loadAll();
    } catch (err) { setError(err.message); }
  };

  const handleDeleteBook = async (id) => {
    if (!confirm('¿Eliminar libro?')) return;
    try { await deleteBook(id); loadAll(); } catch (err) { setError(err.message); }
  };

  const handleDeleteAuthor = async (id) => {
    if (!confirm('¿Eliminar autor?')) return;
    try { await deleteAuthor(id); loadAll(); } catch (err) { setError(err.message); }
  };

  const handleDeleteGenre = async (id) => {
    if (!confirm('¿Eliminar género?')) return;
    try { await deleteGenre(id); loadAll(); } catch (err) { setError(err.message); }
  };

  if (loading) return <Loading />;

  return (
    <div style={{ padding: '1rem 2rem' }}>
      <h1>Panel de administración</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Libros */}
      <section style={styles.section}>
        <h2>Libros</h2>
        <form onSubmit={handleCreateBook} style={styles.form}>
          <input placeholder="Título" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} style={styles.input} />
          <select value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} style={styles.input}>
            <option value="">Autor...</option>
            {authors.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
          <select value={bookForm.genre} onChange={(e) => setBookForm({ ...bookForm, genre: e.target.value })} style={styles.input}>
            <option value="">Género...</option>
            {genres.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
          <input type="number" min="0" value={bookForm.stock} onChange={(e) => setBookForm({ ...bookForm, stock: Number(e.target.value) })} style={styles.input} />
          <input placeholder="Descripción" value={bookForm.description} onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })} style={styles.input} />
          <button type="submit" style={styles.button}>Crear libro</button>
        </form>
        <ul style={styles.list}>
          {books.map((b) => (
            <li key={b._id} style={styles.item}>
              <span>{b.title} — {b.author?.name} ({b.stock} stock)</span>
              <button onClick={() => handleDeleteBook(b._id)} style={styles.deleteBtn}>Eliminar</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Autores */}
      <section style={styles.section}>
        <h2>Autores</h2>
        <form onSubmit={handleCreateAuthor} style={styles.form}>
          <input placeholder="Nombre" value={authorForm.name} onChange={(e) => setAuthorForm({ ...authorForm, name: e.target.value })} style={styles.input} />
          <input placeholder="Nacionalidad" value={authorForm.nationality} onChange={(e) => setAuthorForm({ ...authorForm, nationality: e.target.value })} style={styles.input} />
          <button type="submit" style={styles.button}>Crear autor</button>
        </form>
        <ul style={styles.list}>
          {authors.map((a) => (
            <li key={a._id} style={styles.item}>
              <span>{a.name} {a.nationality && `(${a.nationality})`}</span>
              <button onClick={() => handleDeleteAuthor(a._id)} style={styles.deleteBtn}>Eliminar</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Géneros */}
      <section style={styles.section}>
        <h2>Géneros</h2>
        <form onSubmit={handleCreateGenre} style={styles.form}>
          <input placeholder="Nombre" value={genreForm.name} onChange={(e) => setGenreForm({ name: e.target.value })} style={styles.input} />
          <button type="submit" style={styles.button}>Crear género</button>
        </form>
        <ul style={styles.list}>
          {genres.map((g) => (
            <li key={g._id} style={styles.item}>
              <span>{g.name}</span>
              <button onClick={() => handleDeleteGenre(g._id)} style={styles.deleteBtn}>Eliminar</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

const styles = {
  section: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' },
  form: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' },
  input: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' },
  button: { padding: '0.5rem 1rem', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  deleteBtn: { padding: '0.3rem 0.8rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0 },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid #eee', gap: '0.5rem', flexWrap: 'wrap' },
};

export default AdminDashboard;