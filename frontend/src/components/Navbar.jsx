import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav style={styles.nav}>
      <div style={styles.topBar}>
        <Link to="/" style={styles.logo} onClick={closeMenu}>
          📚 Biblioteca
        </Link>

        {/* Botón hamburguesa - visible solo en móvil */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={styles.hamburger}
          aria-label="Abrir menú"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Menú desktop - visible solo en pantallas grandes */}
        <div style={styles.desktopMenu}>
          <Link to="/" style={styles.link}>Catálogo</Link>
          {user && <Link to="/mis-prestamos" style={styles.link}>Mis Préstamos</Link>}
          {user?.role === 'admin' && <Link to="/admin" style={styles.link}>Admin</Link>}
          {user ? (
            <>
              <span style={styles.user}>👤 {user.name}</span>
              <button onClick={handleLogout} style={styles.button}>Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Registro</Link>
            </>
          )}
        </div>
      </div>

      {/* Menú desplegable móvil */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.mobileLink} onClick={closeMenu}>Catálogo</Link>
          {user && (
            <Link to="/mis-prestamos" style={styles.mobileLink} onClick={closeMenu}>
              Mis Préstamos
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" style={styles.mobileLink} onClick={closeMenu}>
              Admin
            </Link>
          )}
          {user ? (
            <>
              <span style={styles.mobileUser}>👤 {user.name}</span>
              <button onClick={handleLogout} style={styles.mobileButton}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" style={styles.mobileLink} onClick={closeMenu}>
                Registro
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#2c3e50',
    color: 'white',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
  },
  logo: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  hamburger: {
    display: 'none', // se muestra en móvil vía media query más abajo
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.6rem',
    cursor: 'pointer',
    padding: '0.2rem 0.5rem',
  },
  desktopMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '0.95rem',
  },
  user: {
    color: '#ecf0f1',
    fontSize: '0.95rem',
  },
  button: {
    padding: '0.3rem 0.8rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#e74c3c',
    color: 'white',
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0.5rem 1.5rem 1rem',
    backgroundColor: '#34495e',
    gap: '0.5rem',
  },
  mobileLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 0',
    borderBottom: '1px solid #46627f',
  },
  mobileUser: {
    color: '#ecf0f1',
    padding: '0.5rem 0',
  },
  mobileButton: {
    padding: '0.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#e74c3c',
    color: 'white',
    marginTop: '0.3rem',
  },
};

// Media query: en pantallas menores a 768px, ocultar menú desktop
// y mostrar hamburguesa
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @media (max-width: 768px) {
    nav > div > div:last-child { display: none !important; }
    nav button[aria-label="Abrir menú"] { display: block !important; }
  }
`;
document.head.appendChild(styleSheet);

export default Navbar;