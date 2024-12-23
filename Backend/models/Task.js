const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    AttendeeId: { type: String, required: false },
    eventId: { type: String, required: true }
});

module.exports = mongoose.model('Task', taskSchema);
