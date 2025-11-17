require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/error');

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

// rutas 
app.use('/api/usuarios', require('./src/routes/users'));
app.use('/api/productos', require('./src/routes/products'));
app.use('/api/categorias', require('./src/routes/categories'));
app.use('/api/carrito', require('./src/routes/cart'));
app.use('/api/ordenes', require('./src/routes/orders'));
app.use('/api/resenas', require('./src/routes/reviews'));

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
