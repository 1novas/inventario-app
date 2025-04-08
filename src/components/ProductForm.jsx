import { useState } from 'react';
import { crearProducto } from '../services/api';

const ProductForm = ({ onProductoCreado }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!nombre || !precio || !cantidad) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    
    if (precio <= 0) {
      setError('El precio debe ser un valor positivo.');
      return;
    }

    if (cantidad <= 0) {
      setError('La cantidad debe ser un valor positivo.');
      return;
    }

    const nuevoProducto = {
      name: nombre,
      price: parseFloat(precio),
      quantity: parseInt(cantidad),
      description: descripcion
    };

    try {
      await crearProducto(nuevoProducto);
      onProductoCreado();
      setNombre('');
      setPrecio('');
      setCantidad('');
      setDescripcion('');
      setError(null);
      setSuccessMessage('Producto creado con éxito!');
    } catch (err) {
      setError('Error al crear el producto');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h2>Añadir nuevo producto</h2>

      <div>
        <label>Nombre:</label><br />
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>

      <div>
        <label>Precio:</label><br />
        <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
      </div>

      <div>
        <label>Cantidad en inventario:</label><br />
        <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
      </div>

      <div>
        <label>Descripción:</label><br />
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <button type="submit">Crear producto</button>
    </form>
  );
};

export default ProductForm;
