const cors = require('cors');
const express = require('express');
const bcrypt = require('bcrypt'); // For password hashing
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const EventModel = require('./models/EventModel')
const TagModel = require('./models/TagModel')
const UserModel = require("./models/UserModel")

const router = express.Router();
dotenv.config(); // use .env

router.get("/health", (req, res) => res.send("Server running"));

//
// AUTHENTICATION
//
// get token from header and verify authorization
isAuthorized = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send('invalid credentials');
    } else {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, `${process.env.JWT_SECRET_KEY}`, (err, decoded) => {
            if (err) {
                res.status(403).send('invalid credentials');
            } else {
                req.user = decoded; // store user
                next();
            }
        });
    }
}

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check for password security
        if (!password || password.length < 8 || password.length > 24) {
            throw new Error('Password must be 8 to 24 characters in length')
        }

        // check if user's email has already been registered
        const doesExist = await UserModel.findOne({ email });
        if (doesExist) {
            throw new Error('Email already in use')
        }

        // hash the password for extra security
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        user.save()
            .then((newUser) => res.json(newUser))
    } catch (err) {
        res.json({ error: err.message });
    }
}); // register user in DB

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // check user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error('Email not registered')
        }

        // check if passwords match
        const isSame = await bcrypt.compare(password, user.password)
        if (isSame) {
            jwt.sign({ email: user.email, id: user._id, name: user.name }, `${process.env.JWT_SECRET_KEY}`, {}, (err, token) => {
                if (err) { 
                    throw err
                }
                
                res.json({ token: token })
            })
        } else {
            throw new Error('Email and password do not match')
        }
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}); // login user in DB

router.post('/auth', (req, res) => {
    const token = req.body.token;
    jwt.verify(token, `${process.env.JWT_SECRET_KEY}`, (err, _) => {
        if (err) { // invalid token
            return res.status(498).json({ error: "Invalid token" })
        } else {
            return res.status(200).json("authenticated");
        }
    });
}); // authenticate token


//
// TAGS
//
router.post('/createTag', isAuthorized, (req, res) => {
    const tag = new TagModel({
        user: req.user.id,
        name: req.body.name,
        color: req.body.color,
    });
    tag.save()
        .then((newEvent) => res.json(newEvent))
        .catch((err) => res.json(err));
}); // create tag in DB

router.get('/readTags', isAuthorized, (req, res) => {
    TagModel.find({
        user: req.user.id,
    })
        .then((events) => res.json(events))
        .catch((err) => res.json(err))
}); // read user's tags from DB

router.delete('/deleteTag/:id', isAuthorized, async (req, res) => {
    try {
        const id = req.params.id;
        const tag = await TagModel.findById({ _id: id }) // search for event

        // throw error if event not found
        if (!tag) {
            res.status(404)
            throw new Error('Event not found')
        }

        // Ensure user has authorization to delete event
        if (tag.user.toString() !== req.user.id) {
            res.status(401)
            throw new Error("Unauthorized deletion");
        }

        // delete event
        tag.deleteOne()
            .then((event) => res.json(event))
    } catch (err) {
        res.json(err.message)
    }
}); // delete event from DB

//
// EVENTS
//
router.post('/createEvent', isAuthorized, (req, res) => {
    const event = new EventModel({
        user: req.user.id,
        title: req.body.title,
        tag: req.body.tag,
        color: req.body.color,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
    });
    event.save()
        .then((newEvent) => res.json(newEvent))
        .catch((err) => res.json(err));
}); // create event in DB

router.get('/readEvents', isAuthorized, (req, res) => {
    EventModel.find({
        user: req.user.id,
    })
        .then((events) => res.json(events))
        .catch((err) => res.json(err))
}); // read user's events from DB

router.put('/updateEvent/:id', isAuthorized, (res, req) => {
    const id = req.params.id;
    const updatedEvent = {
        title: req.body.title,
        tag: req.body.tag,
        color: req.body.color,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
    };

    EventModel.findByIdAndUpdate(id, updatedEvent)
        .then((event) => res.json(event))
        .catch((err) => res.json(err));
}); // update event

router.delete('/deleteEvent/:id', isAuthorized, async (req, res) => {
    try {
        const id = req.params.id;
        const event = await EventModel.findById({ _id: id }) // search for event

        // throw error if event not found
        if (!event) {
            res.status(404)
            throw new Error('Event not found')
        }

        // Ensure user has authorization to delete event
        if (event.user.toString() !== req.user.id) {
            res.status(401)
            throw new Error("Unauthorized deletion");
        }

        // delete event
        event.deleteOne()
            .then((event) => res.json(event))
    } catch (err) {
        res.json(err.message)
    }
}); // delete event from DB

module.exports = router;