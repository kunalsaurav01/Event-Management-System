import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Attendee = () => {
  const {eventId,eventName} = useParams()
  const [attendees, setAttendees] = useState([]);
  const [newAttendee, setNewAttendee] = useState({ name: '', email: '' });
  const [selectedTask, setSelectedTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/attendees/${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch attendees');
        }
        const data = await response.json();
        setAttendees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [eventId]);   

  // Add a new attendee
  const handleAddAttendee = async (e) => {
    e.preventDefault();
    if (newAttendee.name && newAttendee.email) {
      try {
        const response = await fetch('http://localhost:5000/api/attendees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newAttendee,
            affiliatedEvent: eventId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add attendee');
        }

        const addedAttendee = await response.json();
        setAttendees([...attendees, addedAttendee]);
        setNewAttendee({ name: '', email: '' }); // Clear input fields
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Remove an attendee
  const handleRemoveAttendee = async (attendeeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/attendees/${attendeeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove attendee');
      }

      setAttendees(attendees.filter((attendee) => attendee._id !== attendeeId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Assign an attendee to a specific task
  const handleAssignTask = (attendee) => {
    if (selectedTask) {
      alert(`Assigned ${attendee} to task: ${selectedTask}`);
    }
  };

  return (
    <div>
      <h2>Attendee Management for {eventName}</h2>
      <div>
        <h3>Add Attendee</h3>
        <form onSubmit={handleAddAttendee}>
          <input
            type="text"
            value={newAttendee.name}
            onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
            placeholder="Enter name"
            required
          />
          <input
            type="email"
            value={newAttendee.email}
            onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
            placeholder="Enter email"
            required
          />
          <button type="submit">Add Attendee</button>
        </form>
      </div>

      <div>
        <h3>Assign Task</h3>
        <select onChange={(e) => setSelectedTask(e.target.value)} value={selectedTask}>
          <option value="">Select Task</option>
        </select>
      </div>

      <div>
        <h3>Attendees</h3>
        { loading ? <h2>loading</h2> :
          <ul>
          {attendees.map((attendee, index) => (
            <li key={index}>
              {attendee.name} ({attendee.email})
              <button onClick={() => handleRemoveAttendee(attendee._id)}>Remove</button>
              <button onClick={() => handleAssignTask(attendee)}>Assign Task</button>
            </li>
          ))}
        </ul>
        }
        
      </div>

    </div>
  );
};

export default Attendee;
