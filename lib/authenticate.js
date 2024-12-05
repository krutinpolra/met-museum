import { jwtDecode } from 'jwt-decode';

export function setToken(token) {
  localStorage.setItem('access_token', token);
}

export function getToken() {
  try {
    return localStorage.getItem('access_token');
  } catch (err) {
    return null;
  }
}

export function removeToken() {
  localStorage.removeItem('access_token');
}

export function readToken() {
  try {
    const token = getToken();
    const decoded = jwtDecode(token);
    return decoded;
  } catch (err) {
    return null;
  }
}

export function isAuthenticated() {
  const token = readToken();
  return token ? true : false; // Check expiration
}

export async function authenticateUser(userName, password) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, password }),
  });

  if (res.status === 200) {
    const { token } = await res.json();
    setToken(token);
    return true;
  } else {
    const errorData = await res.json();
    throw new Error(errorData.message);
  }
}

export async function registerUser(userName, password, password2) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, password, password2 }),
  });

  if (res.ok) {
      return true; // Registration successful
  } else {
      const errorData = await res.json();
      throw new Error(errorData.message);
  }
}
