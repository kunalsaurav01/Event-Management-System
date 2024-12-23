const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Create an Event
router.post('/', async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Get All Events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().populate('attendees');
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an Event
router.put('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete an Event
router.delete('/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
