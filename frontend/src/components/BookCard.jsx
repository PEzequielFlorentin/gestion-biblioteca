import { Link } from 'react-router-dom';

const BookCard = ({ book }) => (
  <div style={styles.card}>
    <h3 style={styles.title}>{book.title}</h3>
    <p style={styles.text}>✍️ {book.author?.name}</p>
    <p style={styles.text}>🏷️ {book.genre?.name}</p>
    <p style={styles.text}>📦 Stock: {book.stock}</p>
    <Link to={`/books/${book._id}`} style={styles.link}>Ver detalle</Link>
  </div>
);

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: { margin: '0 0 0.5rem 0', fontSize: '1.1rem' },
  text: { margin: '0.2rem 0', fontSize: '0.9rem', color: '#555' },
  link: {
    display: 'inline-block',
    marginTop: '0.5rem',
    color: '#2980b9',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default BookCard;