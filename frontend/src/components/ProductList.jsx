// frontend/src/components/ProductList.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

const ProductList = ({ onSelectProduct }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3001/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error al cargar productos:', error.message);
            }
        };


        fetchData();

        // Configurar el socket para escuchar cambios en tiempo real
        const socket = io('http://localhost:3001');
        socket.on('newProduct', (newProduct) => {
            setProducts((prevProducts) => [...prevProducts, newProduct]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h2>Productos Disponibles</h2>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.name} - ${product.price.toFixed(2)}{' '}
                        <button onClick={() => onSelectProduct(product)}>Seleccionar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

ProductList.propTypes = {
    onSelectProduct: PropTypes.func.isRequired,
};

export default ProductList;
