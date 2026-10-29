const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

// Location of the database file
const dbFile = path.join(__dirname, 'products.db');

// Locations of the SQL files
const schemaFile = path.join(
    __dirname, 'database', 'schema.sql'
);

const sampleDataFile = path.join(
    __dirname, 'database', 'sample-data.sql'
);

// Function to initialize the database
async function initializeDatabase() {

    // Initialize SQLite
    const SQL = await initSqlJs();

    let db;

    // Load an existing database or create a new one
    if (fs.existsSync(dbFile)) {

        const fileData = fs.readFileSync(dbFile);
        db = new SQL.Database(fileData);

    } else {

        db = new SQL.Database();

    }

    // Read and execute the table creation SQL
    const schema = fs.readFileSync(schemaFile, 'utf8');
    db.run(schema);

    // Count the existing products
    const result = db.exec(
        'SELECT COUNT(*) AS count FROM products'
    );

    const productCount = result[0].values[0][0];

    // Insert sample products if the table is empty
    if (productCount === 0) {

        const sampleData = fs.readFileSync(
            sampleDataFile, 'utf8'
        );

        db.run(sampleData);

    }

    // Save the database to a file
    const databaseData = db.export();

    fs.writeFileSync(
        dbFile,
        Buffer.from(databaseData)
    );

    return db;
}

// Run this file directly to test the database
if (require.main === module) {

    initializeDatabase()
        .then((db) => {

            const result = db.exec(
                'SELECT id, name, price, category FROM products'
            );

            console.log(
                'Database initialized successfully!'
            );

            console.table(
                result[0].values.map((row) => ({
                    id: row[0],
                    name: row[1],
                    price: row[2],
                    category: row[3]
                }))
            );

            db.close();

        })
        .catch((error) => {

            console.error(
                'Database initialization failed:',
                error.message
            );

            process.exitCode = 1;

        });
}

module.exports = initializeDatabase;