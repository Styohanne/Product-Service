const express = require('express');
const router = express.Router();
const fs = require('fs');
const filePath = path.join(__dirname, '../products.json');

// Helper to read JSON
function readProducts() {
  return JSON.parse(fs.readFileSync(filePath));
}

// Helper to write JSON
function writeProducts(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 🟢 GET all products
router.get('/', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// 🔵 GET product by ID
router.get('/:id', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.productId === req.params.id);
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
});

// 🟡 CREATE a product
router.post('/', (req, res) => {
  const products = readProducts();
  const newProduct = req.body;

  if (!newProduct.productId || !newProduct.name || newProduct.quantity == null || newProduct.price == null) {
    return res.status(400).json({ message: 'All product fields are required' });
  }

  if (products.find(p => p.productId === newProduct.productId)) {
    return res.status(400).json({ message: 'Product ID already exists' });
  }

  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// 🟠 UPDATE a product
router.put('/:id', (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.productId === req.params.id);

  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  const updatedProduct = { ...products[index], ...req.body };
  products[index] = updatedProduct;
  writeProducts(products);
  res.json(updatedProduct);
});

// 🔴 DELETE a product
router.delete('/:id', (req, res) => {
  let products = readProducts();
  const index = products.findIndex(p => p.productId === req.params.id);

  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  const deleted = products.splice(index, 1);
  writeProducts(products);
  res.json({ message: 'Product deleted', product: deleted[0] });
});

module.exports = router;