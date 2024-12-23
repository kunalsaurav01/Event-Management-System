require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connection');
const eventRoutes = require('./routes/eventRoutes');
const attendeeRoutes = require('./routes/attendeeRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(require('cors')());

// Database Connection
connectDB();

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/attendees', attendeeRoutes);
app.use('/api/tasks', taskRoutes);

app.use('/',(req,res,next)=>{
    try{
        res.send("<h1>API is working<h1/>");

    }
    catch(err){
        res.status(500).json({error: err.message});
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
