const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3001;

app.use(cors());
app.use(express.json());

const databasePath = path.resolve(__dirname, '../database');

const initializeDataFile = (fileName) => {
    const filePath = path.join(databasePath, `${fileName}.js`);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, `module.exports = [];`);
    }
};

initializeDataFile('products');

let productsData = require('../database/products');

app.get('/products', (req, res) => {
    try {
        res.json(productsData);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

app.post('/products', (req, res) => {
    try {
        const newProduct = {
            id: Date.now(),
            name: req.body.name,
            category: req.body.category,
            price: parseFloat(req.body.price),
        };

        productsData.push(newProduct);
        fs.writeFileSync(path.join(databasePath, 'products.js'), `module.exports = ${JSON.stringify(productsData, null, 2)};`);

        // Emitir evento al cliente WebSocket para notificar la adición de un nuevo producto
        io.emit('newProduct', newProduct);

        res.json(newProduct);
    } catch (error) {
        console.error('Error en POST /products:', error.message);
        res.status(500).json({ error: error.message });
    }
});

io.on('connection', (socket) => {
    console.log('Cliente WebSocket conectado');

    socket.on('disconnect', () => {
        console.log('Cliente WebSocket desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor backend en ejecución en https://gtpwws-3001.csb.app/products`);
});
