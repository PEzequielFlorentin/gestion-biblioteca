import { useState, useEffect } from 'react';
import { getBooks } from '../services/api';
import BookCard from '../components/BookCard';
import Loading from '../components/Loading';

const Catalog = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const genres = [...new Set(books.map((b) => b.genre?.name).filter(Boolean))];

  const filteredBooks = books.filter((book) => {
    const matchesTitle = book.title.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = !genreFilter || book.genre?.name === genreFilter;
    return matchesTitle && matchesGenre;
  });

  if (loading) return <Loading />;
  if (error) return <p style={{ color: 'red', padding: '1rem' }}>{error}</p>;

  return (
    <div style={{ padding: '1rem 2rem' }}>
      <h1>Catálogo de libros</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.5rem', flex: 1, minWidth: '200px' }}
        />
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          style={{ padding: '0.5rem' }}
        >
          <option value="">Todos los géneros</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      {filteredBooks.length === 0 ? (
        <p>No se encontraron libros.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
        }}>
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;