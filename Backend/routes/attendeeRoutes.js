const express = require('express');
const router = express.Router();
const Attendee = require('../models/Attendee');

// Add an Attendee
router.post('/', async (req, res) => {
    try {
        const attendee = new Attendee(req.body);
        await attendee.save();
        res.status(201).json(attendee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get All Attendees
router.get('/:eventid', async (req, res) => {
    const {eventid} = req.params
    try {
        const attendees = await Attendee.find({affiliatedEvent: eventid});
        res.json(attendees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an Attendee
router.delete('/:id', async (req, res) => {
    try {
        await Attendee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Attendee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
