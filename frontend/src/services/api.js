const API_URL = import.meta.env.VITE_API_URL;

// Helper para obtener el token del sessionStorage
const getToken = () => sessionStorage.getItem('token');

// Helper genérico para hacer requests
const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error en la petición');
  }

  return data;
};

// Auth
export const login = (email, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (name, email, password) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });

// Books
export const getBooks = () => request('/books');
export const getBookById = (id) => request(`/books/${id}`);
export const createBook = (book) =>
  request('/books', { method: 'POST', body: JSON.stringify(book) });
export const updateBook = (id, book) =>
  request(`/books/${id}`, { method: 'PUT', body: JSON.stringify(book) });
export const deleteBook = (id) =>
  request(`/books/${id}`, { method: 'DELETE' });

// Authors
export const getAuthors = () => request('/authors');
export const createAuthor = (author) =>
  request('/authors', { method: 'POST', body: JSON.stringify(author) });
export const deleteAuthor = (id) =>
  request(`/authors/${id}`, { method: 'DELETE' });

// Genres
export const getGenres = () => request('/genres');
export const createGenre = (genre) =>
  request('/genres', { method: 'POST', body: JSON.stringify(genre) });
export const deleteGenre = (id) =>
  request(`/genres/${id}`, { method: 'DELETE' });

// Loans
export const createLoan = (bookId) =>
  request('/loans', { method: 'POST', body: JSON.stringify({ bookId }) });
export const getMyLoans = () => request('/loans/mis');
export const getAllLoans = () => request('/loans');
export const returnLoan = (id) =>
  request(`/loans/${id}/devolver`, { method: 'PUT' });