# E-Commerce Product Listing Website

A simple full-stack e-commerce product listing website developed as a programming lab assignment. Users can browse products, view product details, and search the catalogue. The frontend communicates with a Node.js and Express.js backend, which retrieves product information from a SQLite database.

## Features

- Displays products with a name, description, price, category, and image.
- Search products by name, description, or category.
- View the details of an individual product.
- Uses a SQLite database to store product information.
- Provides REST API endpoints for retrieving products.
- Validates search input and product IDs.
- Returns suitable HTTP status codes for successful requests and errors.
- Responsive page layout for different screen sizes.

> Note: Category filtering is available only if the category-filter control and its JavaScript handling have been added to the frontend.

## Technologies Used

- **HTML** — structures the web pages.
- **CSS** — styles the website and product cards.
- **JavaScript** — loads data from the API and updates the page.
- **Node.js** — runs JavaScript on the server.
- **Express.js** — handles HTTP requests and defines API routes.
- **SQLite with sql.js** — stores and retrieves product data.
- **SQL** — creates the products table and inserts sample products.

## Project Structure

ecommerce-app/
├── backend/
│   ├── database/
│   │   ├── schema.sql
│   │   └── sample-data.sql
│   ├── database.js
│   ├── products.db
│   ├── server.js
│   └── package.json
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js


## Requirements

Install the following before running the project:

- Node.js and npm
- A web browser
- Visual Studio Code or another code editor (optional)

## Setup and Installation

### 1. Open the project folder

Open the `ecommerce-app` folder in Visual Studio Code.

### 2. Open the backend terminal

In the VS Code terminal, change to the backend directory:

```powershell
cd backend
```

If the terminal is not already at the project root, first navigate to your `ecommerce-app` folder.

### 3. Install dependencies

If the dependencies are not installed yet, run:

```powershell
npm install
```

The backend uses Express.js and sql.js. If the project does not yet have a `package.json` with these dependencies, run:

```powershell
npm install express sql.js
```

### 4. Initialize the database

The server initializes the SQLite database when it starts. It creates the `products` table if needed and inserts the sample data when the table is empty.

To initialize and check the database separately, run:

```powershell
node database.js
```

### 5. Start the server

From the `backend` directory, run:

```powershell
node server.js
```

The terminal should show a message similar to:

```text
Server running at http://localhost:3000
Database connected successfully.
```

Keep this terminal open while using the website.

### 6. Open the website

Open this address in your browser:

**http://localhost:3000/**

Express serves the frontend files, so you do not need to open `index.html` directly.

## API Endpoints

The backend provides the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Returns all products. |
| GET | `/api/products?search=watch` | Searches product names, descriptions, and categories. |
| GET | `/api/products/1` | Returns details for the product with ID `1`. |

Replace `1` with another product ID to view a different product.

### Example response

A successful request to `/api/products/1` returns a JSON object similar to:

```json
{
  "id": 1,
  "name": "Wireless Headphones",
  "description": "Comfortable wireless headphones for everyday listening.",
  "price": 1499,
  "image": "https://placehold.co/400x300?text=Headphones",
  "category": "Electronics"
}
```

The actual response depends on the product records in your database.

## Validation and HTTP Status Codes

- **200 OK** — the request succeeded.
- **400 Bad Request** — the supplied search input or product ID is invalid.
- **404 Not Found** — the requested product ID does not exist.

The backend uses parameterized SQL queries for search and product ID lookups.

## Database

The database contains a `products` table with these columns:

| Column | Purpose |
|---|---|
| `id` | Unique product ID; generated automatically. |
| `name` | Product name. |
| `description` | Product description. |
| `price` | Product price; must not be negative. |
| `image` | Image URL used to display the product image. |
| `category` | Product category. |

- `database/schema.sql` defines the table.
- `database/sample-data.sql` contains the initial sample products.
- `database.js` initializes the database and saves it to `products.db`.

Product images may be loaded from external image URLs, so an internet connection may be required to display them.

## How It Works

1. The browser loads the frontend files served by Express.
2. `script.js` sends a request to the backend using `fetch()`.
3. Express receives the request and runs the appropriate API route in `server.js`.
4. The backend queries the SQLite database.
5. The API returns product information as JSON.
6. The frontend JavaScript uses the response to display product cards or product details.

## Troubleshooting

- **The website does not open:** Make sure the server is running and visit `http://localhost:3000/`.
- **Port 3000 is already in use:** Stop the other process using that port or change the `PORT` value in `server.js`.
- **Products do not appear:** Check the terminal for errors and confirm that `products.db`, `database.js`, and the SQL files are present.
- **Images do not load:** Check your internet connection and verify the image URLs.
- **A dependency is missing:** Run `npm install` from the `backend` directory.

## Current Scope

This project focuses on product listing, searching, product details, API development, and database integration. It does not include a shopping cart, checkout, payment processing, or user authentication unless those features are added separately.

## Author

Created as a programming lab assignment.
