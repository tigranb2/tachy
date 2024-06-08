const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');


const router = require('./routes/router');

dotenv.config(); // use .env

const app = express();
app.use(cors({
    origin : `http://tachy.netlify.app`, // frontend url
    credentials: true, // accept cookies
}));
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))

app.use(router);

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(3000);
});