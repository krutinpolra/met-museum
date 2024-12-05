import { getToken } from './authenticate';

async function makeRequest(endpoint, method = 'GET', body = null) {
  const token = getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (res.status === 200) {
    return await res.json();
  } else {
    return [];
  }
}

export async function addToFavourites(id) {
  return await makeRequest(`favourites/${id}`, 'PUT');
}

export async function removeFromFavourites(id) {
  return await makeRequest(`favourites/${id}`, 'DELETE');
}

export async function getFavourites() {
  return await makeRequest(`favourites`);
}

export async function addToHistory(id) {
  return await makeRequest(`history/${id}`, 'PUT');
}

export async function removeFromHistory(id) {
  return await makeRequest(`history/${id}`, 'DELETE');
}

export async function getHistory() {
  return await makeRequest(`history`);
}
