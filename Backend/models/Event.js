const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendee' }] // Optional
}, {
    collection: 'event_management' // Explicitly set the collection name
});

module.exports = mongoose.model('Event', eventSchema);
