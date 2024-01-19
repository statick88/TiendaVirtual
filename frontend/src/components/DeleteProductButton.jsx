import PropTypes from 'prop-types';

const DeleteProductButton = ({ productId, onDeleteSubmit }) => {
    const handleDelete = () => {
        onDeleteSubmit(productId);
    };

    return (
        <button onClick={handleDelete}>Eliminar producto</button>
    );
};

DeleteProductButton.propTypes = {
    productId: PropTypes.number.isRequired,
    onDeleteSubmit: PropTypes.func.isRequired,
};

export default DeleteProductButton;
