import { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import socketIOClient from 'socket.io-client';
import './App.css';

const ENDPOINT = 'http://localhost:3001';

const App = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch(`${ENDPOINT}/products`);
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (error) {
        console.error('Error al cargar datos:', error.message);
      }
    };

    fetchData();

    const socket = socketIOClient(ENDPOINT);

    socket.on('updateProducts', (updatedProducts) => {
      // Actualizar la lista de productos cuando se emiten actualizaciones
      setProducts(updatedProducts);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleProductSubmit = async (product) => {
    try {
      let response;
      if (selectedProduct) {
        // Si hay un producto seleccionado, realizar una actualización
        response = await fetch(`${ENDPOINT}/products/${selectedProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });
      } else {
        // Si no hay un producto seleccionado, realizar una adición
        response = await fetch(`${ENDPOINT}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });
      }

      if (response.ok) {
        const updatedProducts = await response.json();
        const socket = socketIOClient(ENDPOINT);
        socket.emit('updateProducts', updatedProducts);
        setSelectedProduct(null);
      } else {
        throw new Error('Error al realizar la operación en el producto.');
      }
    } catch (error) {
      console.error('Error en la solicitud de operación en el producto:', error.message);
    }
  };

  const handleDeleteSubmit = async (productId) => {
    try {
      const response = await fetch(`${ENDPOINT}/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedProducts = await response.json();
        const socket = socketIOClient(ENDPOINT);
        socket.emit('updateProducts', updatedProducts);
        setSelectedProduct(null);
      } else {
        throw new Error('Error al eliminar el producto.');
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminar producto:', error.message);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="App">
      <header>
        <h1>Tienda Virtual de Productos de Tecnología</h1>
      </header>
      <main>
        <section className="product-section">
          <h2>Productos Disponibles</h2>
          <ProductList products={products} onSelectProduct={handleSelectProduct} />
        </section>
        <section className="form-section">
          <h2>{selectedProduct ? 'Actualizar Producto' : 'Agregar Producto'}</h2>
          <ProductForm product={selectedProduct} onProductSubmit={handleProductSubmit} />
        </section>
        {selectedProduct && (
          <section className="form-section">
            <h2>Eliminar Producto</h2>
            <button onClick={() => handleDeleteSubmit(selectedProduct.id)}>Eliminar Producto</button>
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
