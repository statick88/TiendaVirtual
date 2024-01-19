const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const databasePath = path.resolve(__dirname, '../../database');
const productsFilePath = path.join(databasePath, 'products.js');

const getProducts = () => {
    try {
        const products = require(productsFilePath);
        return products;
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        return [];
    }
};

const writeProducts = (products) => {
    try {
        fs.writeFileSync(productsFilePath, `module.exports = ${JSON.stringify(products, null, 2)};`);
    } catch (error) {
        console.error('Error al escribir productos en el archivo:', error.message);
    }
};

router.get('/', (req, res) => {
    const products = getProducts();
    res.json(products);
});

router.post('/', (req, res) => {
    try {
        const newProduct = {
            id: Date.now(), // Generamos un ID único basado en la marca de tiempo
            name: req.body.name,
            category: req.body.category,
            price: parseFloat(req.body.price),
        };

        const products = getProducts();
        products.push(newProduct);

        writeProducts(products);

        res.json(newProduct);
    } catch (error) {
        console.error('Error en POST /products:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
