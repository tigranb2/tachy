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
    origin : `https://tachy.netlify.app`, // frontend url
    credentials: true, // accept cookies
    optionsSuccessStatus: 200 // Set the status code for OPTIONS requests (some browsers require this)
}));
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))

app.use('/api', router);

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(3000);
});