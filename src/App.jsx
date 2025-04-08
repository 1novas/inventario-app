import { useState } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';

function App() {
  const [reload, setReload] = useState(false);

  const recargarProductos = () => setReload(!reload);

  return (
    <>
      <h1>Aplicación de Inventario</h1>
      <ProductForm onProductoCreado={recargarProductos} />
      <ProductList reload={reload} />
    </>
  );
}

export default App;
