// Get HTML elements
const productList = document.getElementById('product-list');
const message = document.getElementById('message');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearButton = document.getElementById('clear-button');

const productDetails = document.getElementById('product-details');
const detailsContent = document.getElementById('details-content');
const backButton = document.getElementById('back-button');

const categoryButtons = document.querySelectorAll('.category-button');

// Store products and the selected category
let currentProducts = [];
let activeCategory = 'All';

// Show a message on the page
function showMessage(text) {
    message.textContent = text;
    message.hidden = false;
}

// Create a product image with a fallback
function createProductImage(product) {
    const image = document.createElement('img');

    image.src = product.image;
    image.alt = product.name;
    image.loading = 'lazy';

    image.addEventListener('error', function () {
        image.onerror = null;
        image.src = 'https://placehold.co/700x500?text=Image+Unavailable';
        image.alt = product.name + ' image unavailable';
    });

    return image;
}

// Display the products that match the selected category
function displayProducts() {
    productList.replaceChildren();

    const filteredProducts = activeCategory === 'All'
        ? currentProducts
        : currentProducts.filter(function (product) {
            return product.category === activeCategory;
        });

    if (filteredProducts.length === 0) {
        showMessage('No products found. Try another search or category.');
        return;
    }

    filteredProducts.forEach(function (product) {
        productList.appendChild(createProductCard(product));
    });

    message.hidden = true;
}

// Create a product card
function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';

    const image = createProductImage(product);

    const info = document.createElement('div');
    info.className = 'product-info';

    const name = document.createElement('h3');
    name.textContent = product.name;

    const description = document.createElement('p');
    description.textContent = product.description;

    const category = document.createElement('span');
    category.className = 'category';
    category.textContent = product.category;

    const price = document.createElement('p');
    price.className = 'price';
    price.textContent =
        '₹' + Number(product.price).toLocaleString('en-IN');

    const detailsButton = document.createElement('button');
    detailsButton.className = 'details-button';
    detailsButton.textContent = 'View Details';

    detailsButton.addEventListener('click', function () {
        loadProductDetails(product.id);
    });

    info.append(name, description, category, price, detailsButton);
    card.append(image, info);

    return card;
}

// Load products from the backend
async function loadProducts(search = '') {
    productList.replaceChildren();
    productDetails.hidden = true;
    productList.hidden = false;

    showMessage('Loading products...');

    try {
        const url = '/api/products?search=' +
            encodeURIComponent(search);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Unable to load products.');
        }

        currentProducts = await response.json();

        displayProducts();

    } catch (error) {
        showMessage('Could not load products. Please try again.');
        console.error(error);
    }
}

// Load details of one product
async function loadProductDetails(id) {
    productList.hidden = true;
    productDetails.hidden = false;
    detailsContent.replaceChildren();

    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Loading product details...';
    detailsContent.appendChild(loadingMessage);

    try {
        const response = await fetch('/api/products/' + id);

        if (!response.ok) {
            throw new Error('Unable to load product details.');
        }

        const product = await response.json();

        detailsContent.replaceChildren();

        const content = document.createElement('div');
        content.className = 'details-content';

        const image = createProductImage(product);

        const text = document.createElement('div');
        text.className = 'details-text';

        const name = document.createElement('h3');
        name.textContent = product.name;

        const description = document.createElement('p');
        description.textContent = product.description;

        const category = document.createElement('p');
        category.textContent = 'Category: ' + product.category;

        const price = document.createElement('p');
        price.className = 'price';
        price.textContent =
            'Price: ₹' + Number(product.price).toLocaleString('en-IN');

        text.append(name, description, category, price);
        content.append(image, text);

        detailsContent.appendChild(content);

    } catch (error) {
        detailsContent.replaceChildren();

        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Could not load product details.';

        detailsContent.appendChild(errorMessage);
        console.error(error);
    }
}

// Handle product search
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();

    loadProducts(searchInput.value.trim());
});

// Clear the search and category filter
clearButton.addEventListener('click', function () {
    searchInput.value = '';
    activeCategory = 'All';

    categoryButtons.forEach(function (button) {
        button.classList.toggle(
            'active',
            button.dataset.category === 'All'
        );
    });

    loadProducts();
});

// Handle category filter buttons
categoryButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        activeCategory = button.dataset.category;

        categoryButtons.forEach(function (item) {
            item.classList.toggle('active', item === button);
        });

        displayProducts();
    });
});

// Return to the product listing
backButton.addEventListener('click', function () {
    productDetails.hidden = true;
    productList.hidden = false;
});

// Load products when the page opens
loadProducts();