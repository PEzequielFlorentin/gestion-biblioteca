import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={styles.container}>
    <h1 style={styles.code}>404</h1>
    <h2 style={styles.title}>Página no encontrada</h2>
    <p style={styles.text}>
      La página que buscás no existe o fue movida.
    </p>
    <Link to="/" style={styles.button}>
      Volver al catálogo
    </Link>
  </div>
);

const styles = {
  container: {
    textAlign: 'center',
    padding: '4rem 1rem',
    maxWidth: '500px',
    margin: '0 auto',
  },
  code: {
    fontSize: '5rem',
    margin: 0,
    color: '#2c3e50',
  },
  title: {
    fontSize: '1.5rem',
    margin: '0.5rem 0',
    color: '#34495e',
  },
  text: {
    color: '#7f8c8d',
    marginBottom: '2rem',
  },
  button: {
    display: 'inline-block',
    padding: '0.6rem 1.2rem',
    backgroundColor: '#2980b9',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
};

export default NotFound;