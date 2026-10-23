import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, createLoan } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBookById(id);
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleLoan = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setMessage('');
    setError('');
    try {
      await createLoan(id);
      setMessage('✅ Préstamo solicitado correctamente');
      const updated = await getBookById(id);
      setBook(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error && !book) return <p style={{ color: 'red', padding: '1rem' }}>{error}</p>;
  if (!book) return <p>Libro no encontrado</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <h1>{book.title}</h1>
      <p><strong>Autor:</strong> {book.author?.name}</p>
      <p><strong>Género:</strong> {book.genre?.name}</p>
      <p><strong>Stock:</strong> {book.stock}</p>
      <p><strong>Descripción:</strong> {book.description || 'Sin descripción'}</p>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {user && book.stock > 0 && (
        <button onClick={handleLoan} style={styles.button}>
          Solicitar préstamo
        </button>
      )}
      {user && book.stock === 0 && <p style={{ color: 'orange' }}>Sin stock disponible</p>}
      {!user && <p><em>Iniciá sesión para solicitar un préstamo</em></p>}
    </div>
  );
};

const styles = {
  button: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#2980b9',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem',
  },
};

export default BookDetail;