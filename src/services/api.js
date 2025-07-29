const API_URL = 'https://inventario-bhkd.api.codehooks.io/dev/productos';
//const API_KEY = "api key";

const headers = {
  'x-apikey': API_KEY,
  'Content-Type': 'application/json'
};

export const getProductos = () =>
  fetch(API_URL, { headers })
    .then(res => res.json())

export const crearProducto = (producto) =>
  fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(producto),
  }).then(res => res.json());

export const editarProducto = (id, producto) =>
  fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(producto),
  }).then(res => res.json());

export const eliminarProducto = (id) =>
  fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers,
  }).then(res => res.json());
