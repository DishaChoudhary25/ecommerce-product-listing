const express = require('express');
const initializeDatabase = require('./database');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to read JSON requests
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Database connection variable
let db;

// Function to convert SQL query results into JavaScript objects
function getProducts(sql, params = []) {
    const statement = db.prepare(sql);

    try {
        statement.bind(params);

        const products = [];

        while (statement.step()) {
            products.push(statement.getAsObject());
        }

        return products;
    } finally {
        statement.free();
    }
}

// API 1: Get all products or search products
app.get('/api/products', (req, res) => {
    const search = req.query.search;

    // Validate the search parameter
    if (search !== undefined && typeof search !== 'string') {
        return res.status(400).json({
            error: 'Search must be a string.'
        });
    }

    if (search !== undefined && search.length > 100) {
        return res.status(400).json({
            error: 'Search must not exceed 100 characters.'
        });
    }

    let products;

    if (search && search.trim() !== '') {
        const searchTerm = '%' + search.trim() + '%';

        products = getProducts(
            `SELECT id, name, description, price, image, category
             FROM products
             WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
             ORDER BY id`,
            [searchTerm, searchTerm, searchTerm]
        );
    } else {
        products = getProducts(
            `SELECT id, name, description, price, image, category
             FROM products
             ORDER BY id`
        );
    }

    res.status(200).json(products);
});

// API 2: Get details of one product
app.get('/api/products/:id', (req, res) => {
    const id = req.params.id;

    // Check whether the ID is a positive integer
    if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
        return res.status(400).json({
            error: 'Product ID must be a positive integer.'
        });
    }

    const products = getProducts(
        `SELECT id, name, description, price, image, category
         FROM products
         WHERE id = ?`,
        [Number(id)]
    );

    if (products.length === 0) {
        return res.status(404).json({
            error: 'Product not found.'
        });
    }

    res.status(200).json(products[0]);
});

// Start the server after initializing the database
initializeDatabase()
    .then((database) => {
        db = database;

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
            console.log('Database connected successfully.');
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error.message);
        process.exitCode = 1;
    });