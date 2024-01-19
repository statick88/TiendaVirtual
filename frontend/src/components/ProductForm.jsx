import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ProductForm = ({ product, onProductSubmit }) => {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');

    useEffect(() => {
        // Si hay un producto proporcionado, establecer los valores iniciales
        if (product) {
            setProductName(product.name || '');
            setProductPrice(product.price || '');
        }
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar que se ingresen los datos necesarios
        if (!productName || !productPrice) {
            console.error('Por favor, ingrese el nombre y el precio del producto.');
            return;
        }

        // Crear un objeto de producto con los datos del formulario
        const newProduct = {
            name: productName,
            price: parseFloat(productPrice),
        };

        // Si hay un producto existente, agregar su ID al objeto
        if (product && product.id) {
            newProduct.id = product.id;
        }

        // Enviar el objeto de producto al manejador del formulario principal
        onProductSubmit(newProduct);

        // Limpiar los campos del formulario
        setProductName('');
        setProductPrice('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Nombre del Producto:
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
            </label>
            <label>
                Precio del Producto:
                <input type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
            </label>
            <button type="submit">{product ? 'Actualizar Producto' : 'Agregar Producto'}</button>
        </form>
    );
};

export default ProductForm;

ProductForm.propTypes = {
    product: PropTypes.object.isRequired,
    onProductSubmit: PropTypes.func.isRequired,
};
