const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const connectToDb = require('./db/db'); 
const userRoutes = require('./Routes/user.routes');
const providerRoutes = require('./Routes/provider.routes');
const authMiddleware = require('./middleware/auth.middleware');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
connectToDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.use('/users', userRoutes);
app.use('/providers', providerRoutes);

module.exports = app;