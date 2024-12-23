import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/navbar'
import Events from './components/events'
import Attendee from './components/attendee';
import Tasks from './components/tasks';

function App() {

  return (
    <>
      <Navbar />
      <Router>
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/attendee/:eventId/:eventName" element={<Attendee />} />
        <Route path="/task/:eventId/:eventName" element={<Tasks />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
