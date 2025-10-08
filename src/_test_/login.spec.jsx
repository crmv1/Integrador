// src/_test_/login.spec.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import Login from '../Login.jsx';
import axios from 'axios';

// 1) Mock de axios (post + get)
vi.mock('axios', () => ({
  default: { post: vi.fn(), get: vi.fn() }
}));

// 2) Mock de react-router-dom -> useNavigate para que NO redirija
vi.mock('react-router-dom', async (orig) => {
  const mod = await orig();
  return {
    ...mod,
    useNavigate: () => vi.fn(),
  };
});

// 3) Variable de entorno usada por el componente
beforeAll(() => {
  process.env.REACT_APP_API = 'http://localhost/backend';
});

beforeEach(() => {
  axios.post.mockReset();
  axios.get.mockReset();
  localStorage.clear();
});

/**
 * PRUEBA 1: Login OK -> guarda role en localStorage
 */
test('Login OK guarda role en localStorage', async () => {
  axios.post.mockResolvedValueOnce({
    data: { success: true, role: 'admin', message: 'Bienvenido' }
  });

  render(<Login />);

  const userInput = screen.getByPlaceholderText(/usuario/i);
  const passInput = screen.getByPlaceholderText(/contraseña/i);
  const submitBtn = screen.getByRole('button', { name: /ingresar/i });

  await user.type(userInput, 'administrador');
  await user.type(passInput, 'adm123');
  await user.click(submitBtn);

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost/backend/login.php',
      { username: 'administrador', password: 'adm123' }
    );
  });

  expect(localStorage.getItem('role')).toBe('admin');
});

/**
 * PRUEBA 2: Login inválido -> muestra error y NO guarda sesión
 */
test('Login inválido muestra error y no guarda sesión', async () => {
  axios.post.mockResolvedValueOnce({
    data: { success: false, message: 'Credenciales incorrectas' }
  });

  render(<Login />);

  const userInput = screen.getByPlaceholderText(/usuario/i);
  const passInput = screen.getByPlaceholderText(/contraseña/i);
  const submitBtn = screen.getByRole('button', { name: /ingresar/i });

  await user.type(userInput, 'administrador');
  await user.type(passInput, 'mala');
  await user.click(submitBtn);

  expect(await screen.findByText(/credenciales incorrectas|error de conexión/i))
    .toBeInTheDocument();
  expect(localStorage.getItem('role')).toBeNull();
});

/**
 * PRUEBA 3: Envía payload correcto y guarda role
 */
test('Envía payload correcto a /login.php y guarda role', async () => {
  axios.post.mockImplementationOnce(async (url, body) => {
    expect(url).toBe('http://localhost/backend/login.php');
    expect(body).toEqual({ username: 'administrador', password: 'adm123' });
    return { data: { success: true, role: 'admin' } };
  });

  render(<Login />);

  const userInput = screen.getByPlaceholderText(/usuario/i);
  const passInput = screen.getByPlaceholderText(/contraseña/i);
  const submitBtn = screen.getByRole('button', { name: /ingresar/i });

  await user.type(userInput, 'administrador');
  await user.type(passInput, 'adm123');
  await user.click(submitBtn);

  await waitFor(() => {
    expect(localStorage.getItem('role')).toBe('admin');
  });
});
