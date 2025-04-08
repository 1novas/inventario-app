import { useEffect, useState } from 'react';
import { getProductos, eliminarProducto, editarProducto } from '../services/api';

const ProductList = ({ reload }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    getProductos()
      .then(data => {
        setProductos(data);
        setLoading(false);
      })
      .catch(() => {
        console.error('Error al cargar productos');
        setLoading(false);
      });
  }, [reload]);

  const handleDelete = async (id) => {
    if (confirm('¿Seguro que quieres eliminar este producto?')) {
      await eliminarProducto(id);
      setProductos(productos.filter(p => p._id !== id));
    }
  };

  const startEdit = (producto) => {
    setEditingId(producto._id);
    setFormData({ ...producto });
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await editarProducto(editingId, {
      name: formData.name,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      description: formData.description
    });
    setEditingId(null);
    setFormData({});
    const updated = await getProductos();
    setProductos(updated);
  };

  const handleEntradas = async (id, cantidad) => {
    try {
      const producto = productos.find(p => p._id === id);
      if (!producto) {
        throw new Error('Producto no encontrado');
      }
  
      const productoActualizado = {
        ...producto,
        quantity: cantidad + 1
      };
  
      setProductos(prevProductos => prevProductos.map(p => 
        p._id === id ? productoActualizado : p
      ));
  
      await editarProducto(id, productoActualizado);
    } catch (err) {
      setError('Error al actualizar entradas');
    }
  };
  
  const handleSalidas = async (id, cantidad) => {
    if (cantidad <= 0) {
      setError('No se puede vender un producto con stock 0');
      return;
    }
  
    try {
      const producto = productos.find(p => p._id === id);
      if (!producto) {
        throw new Error('Producto no encontrado');
      }
  
      const productoActualizado = {
        ...producto,
        quantity: cantidad - 1
      };
  
      setProductos(prevProductos => prevProductos.map(p => 
        p._id === id ? productoActualizado : p
      ));
  
      await editarProducto(id, productoActualizado);
    } catch (err) {
      setError('Error al actualizar salidas');
    }
  };
  

  if (loading) return <p>Cargando productos...</p>;
  if (productos.length === 0) return <p>No hay productos disponibles.</p>;

  return (
    <div>
      <h2>Inventario de Productos</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto._id}>
              {editingId === producto._id ? (
                <>
                  <td><input name="name" value={formData.name} onChange={handleEditChange} /></td>
                  <td><input name="price" type="number" value={formData.price} onChange={handleEditChange} /></td>
                  <td><input name="quantity" type="number" value={formData.quantity} onChange={handleEditChange} /></td>
                  <td><input name="description" value={formData.description} onChange={handleEditChange} /></td>
                  <td>
                    <button onClick={handleEditSubmit}>Guardar</button>
                    <button onClick={() => setEditingId(null)}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{producto.name}</td>
                  <td>${producto.price}</td>
                  <td>{producto.quantity}</td>
                  <td>{producto.description}</td>
                  <td>
                    <button onClick={() => startEdit(producto)}>Editar</button>
                    <button onClick={() => handleDelete(producto._id)}>Eliminar</button>
                    <button onClick={() => handleEntradas(producto._id, producto.quantity)}>Entradas (+1)</button>
                    <button onClick={() => handleSalidas(producto._id, producto.quantity)}>Salidas (-1)</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
