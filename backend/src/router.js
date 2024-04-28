const express = require('express');

const EventModel = require('./models/EventModel')

const router = express.Router();

router.post('/createEvent', (req, res) => {
    const event = new EventModel({
        tag: req.body.tag,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
    });
    event.save()
        .then((newEvent) => res.json(newEvent))
        .catch((err) => res.json(err));
}); // create event in DB

router.get('/readEvent', (req, res) => {
    EventModel.find({})
        .then((events) => res.json(events))
        .catch((err) => res.json(err))
}); // read events from DB

router.put('/updateEvent/:id', (res, req) => {
    const id = req.params.id;
    const updatedEvent = {
        tag: req.body.tag,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
    };

    EventModel.findByIdAndUpdate(id, updatedEvent)
        .then((event) => res.json(event))
        .catch((err) => res.json(err));
}); // update event

router.delete('/deleteEvent/:id', (req, res) => {
    const id = req.params.id;
    EventModel.findByIdAndDelete({ _id: id })
        .then((event) => res.json(event))
        .catch((err) => res.json(err));
}); // delete event from DB

module.exports = router;