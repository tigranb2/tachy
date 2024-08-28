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
    // origin : `https://tachy.pages.dev`, // frontend url
    origin : `http://localhost:5173`, // testing
    credentials: true, // accept cookies
}));

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))

app.use(router);

const port = process.env.PORT || 4000;

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected to mongo")
    app.listen(port);
}).catch((err) => {
    console.log({ err });
    process.exit(1);
});