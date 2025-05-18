const express = require('express');
const fs = require('fs');
const path = require('path');
const productsRoutes = require('./routes/products');

const app = express();
const PORT = 1337;

app.use(express.json());
app.use('/api/products', productsRoutes);

app.listen(PORT, () => {
  console.log(`Rice shop server running on http://localhost:${PORT}`);
});