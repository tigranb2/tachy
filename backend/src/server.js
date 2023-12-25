const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');


const router = require('./router');

dotenv.config(); // use .env

const app = express();
app.use(cors());
//app.use(morgan('tiny'));
app.use(router);

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(8080);
});