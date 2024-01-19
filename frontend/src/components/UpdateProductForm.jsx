import { useState } from 'react';
import PropTypes from 'prop-types';

const UpdateProductForm = ({ product, onUpdateSubmit }) => {
    const [productName, setProductName] = useState(product.name);
    const [productCategory, setProductCategory] = useState(product.category);
    const [productPrice, setProductPrice] = useState(product.price.toString());

    const handleSubmit = (e) => {
        e.preventDefault();
        if (productName && productCategory && productPrice) {
            const updatedProduct = {
                id: product.id,
                name: productName,
                category: productCategory,
                price: parseFloat(productPrice),
            };
            onUpdateSubmit(updatedProduct);
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
            <button type="submit">Actualizar producto</button>
        </form>
    );
};

UpdateProductForm.propTypes = {
    product: PropTypes.object.isRequired,
    onUpdateSubmit: PropTypes.func.isRequired,
};

export default UpdateProductForm;
