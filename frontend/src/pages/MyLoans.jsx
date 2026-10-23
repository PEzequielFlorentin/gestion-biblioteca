import { useState, useEffect } from 'react';
import { getMyLoans, getAllLoans, returnLoan } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const MyLoans = () => {
  const { user } = useAuth();
  const [myLoans, setMyLoans] = useState([]);
  const [allLoans, setAllLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'admin';

  const loadData = async () => {
    setLoading(true);
    try {
      const mine = await getMyLoans();
      setMyLoans(mine);

      if (isAdmin) {
        const all = await getAllLoans();
        setAllLoans(all);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReturnLoan = async (id) => {
    try {
      await returnLoan(id);
      loadData(); // recarga ambas listas
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p style={{ color: 'red', padding: '1rem' }}>{error}</p>;

  // Tabla reutilizable para mostrar préstamos
  const renderLoansTable = (loans, showClient = false, showAction = false) => {
    if (loans.length === 0) {
      return <p>No hay préstamos registrados.</p>;
    }
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              {showClient && <th style={styles.th}>Cliente</th>}
              {showClient && <th style={styles.th}>Email</th>}
              <th style={styles.th}>Libro</th>
              <th style={styles.th}>Fecha</th>
              <th style={styles.th}>Estado</th>
              {showAction && <th style={styles.th}>Acción</th>}
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id}>
                {showClient && (
                  <td style={styles.td}>{loan.user?.name || 'Usuario eliminado'}</td>
                )}
                {showClient && (
                  <td style={styles.td}>{loan.user?.email || '—'}</td>
                )}
                <td style={styles.td}>{loan.book?.title || 'Libro eliminado'}</td>
                <td style={styles.td}>
                  {new Date(loan.loanDate).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  <span style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    backgroundColor: loan.status === 'pendiente' ? '#f39c12' : '#27ae60',
                    color: 'white',
                  }}>
                    {loan.status}
                  </span>
                </td>
                {showAction && (
                  <td style={styles.td}>
                    {loan.status === 'pendiente' ? (
                      <button
                        onClick={() => handleReturnLoan(loan._id)}
                        style={styles.button}
                      >
                        Marcar devuelto
                      </button>
                    ) : (
                      <span style={{ color: '#888', fontSize: '0.85rem' }}>
                        Devuelto el {new Date(loan.returnDate).toLocaleDateString()}
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{ padding: '1rem 2rem' }}>
      <h1>{isAdmin ? 'Préstamos' : 'Mis Préstamos'}</h1>

      {/* Sección 1: Mis Préstamos (siempre visible) */}
      <section style={styles.section}>
        <h2>Mis Préstamos</h2>
        {renderLoansTable(myLoans, false, false)}
      </section>

      {/* Sección 2: Todos los Préstamos (solo admin) */}
      {isAdmin && (
        <section style={styles.section}>
          <h2>Todos los Préstamos</h2>
          {renderLoansTable(allLoans, true, true)}
        </section>
      )}
    </div>
  );
};

const styles = {
  section: {
    marginBottom: '2rem',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  },
  th: {
    textAlign: 'left',
    padding: '0.6rem',
    backgroundColor: '#2c3e50',
    color: 'white',
    fontWeight: 'bold',
  },
  td: {
    padding: '0.6rem',
    borderBottom: '1px solid #eee',
    verticalAlign: 'middle',
  },
  button: {
    padding: '0.3rem 0.8rem',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default MyLoans;