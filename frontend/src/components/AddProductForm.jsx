import { useState } from 'react';
import PropTypes from 'prop-types';

const AddProductForm = ({ onProductSubmit }) => {
    const [productName, setProductName] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productPrice, setProductPrice] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (productName && productCategory && productPrice) {
            const newProduct = {
                name: productName,
                category: productCategory,
                price: parseFloat(productPrice),
            };
            onProductSubmit(newProduct);
            // Limpiar los campos después de la presentación
            setProductName('');
            setProductCategory('');
            setProductPrice('');
        } else {
            console.error('Todos los campos son obligatorios.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Nombre del producto"
            />
            <input
                type="text"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                placeholder="Categoría del producto"
            />
            <input
                type="text"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="Precio del producto"
            />
            <button type="submit">Agregar producto</button>
        </form>
    );
};

AddProductForm.propTypes = {
    onProductSubmit: PropTypes.func.isRequired,
};

export default AddProductForm;
