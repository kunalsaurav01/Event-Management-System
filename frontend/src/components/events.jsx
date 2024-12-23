import React, { useEffect, useState } from 'react';
import style from '../style/events.module.css';
import { useNavigate } from 'react-router-dom';

function Events() {
    const [events, setEvents] = useState([]); // State to store events
    const [showPopup, setShowPopup] = useState(false); // State to toggle popup
    const [newEvent, setNewEvent] = useState({ name: '', description: '', location: '', date: '' });
    const navigate = useNavigate();
    // Fetch events from the backend API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/events');
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleAddEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),
            });

            if (response.ok) {
                const addedEvent = await response.json();
                setEvents((prevEvents) => [...prevEvents, addedEvent]); // Add new event to the list
                setShowPopup(false); // Close the popup
                setNewEvent({ name: '', description: '', location: '', date: '' }); // Reset form
            } else {
                console.error('Failed to add event:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

    return (
        <>
            <div className={style.addingContainer}>
                <div className="Event-text-container">Events</div>
                <div className="add-event">
                    <button onClick={() => setShowPopup(true)}>Add Event</button>
                </div>
            </div>
            <div className={style.eventListContainer}>
                {events.length > 0 ? (
                    events.map((event, index) => (
                        <div key={index} className={`Event-${index}`}>
                            <h3>{event.name}</h3>
                            <p>{event.description}</p>
                            <p>{event.location}</p>
                            <p>{new Date(event.date).toLocaleString()}</p>
                            <p>
                                <button onClick={()=> navigate(`/attendee/${event._id}/${event.name}`)}>view Attendee</button>
                            </p>
                            <p>
                                <button onClick={()=> navigate(`/task/${event._id}/${event.name}`)}>view Tasks</button>
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No events available. Please add one!</p>
                )}
            </div>

            {/* Popup for adding a new event */}
            {showPopup && (
                <div className={style.popup}>
                    <div className={style.popupContent}>
                        <h2>Add New Event</h2>
                        <form onSubmit={handleAddEvent}>
                            <label>
                                Event Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={newEvent.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    name="description"
                                    value={newEvent.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                Location:
                                <input
                                    type="text"
                                    name="location"
                                    value={newEvent.location}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                Date:
                                <input
                                    type="datetime-local"
                                    name="date"
                                    value={newEvent.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <div className={style.popupActions}>
                                <button type="submit">Add Event</button>
                                <button type="button" onClick={() => setShowPopup(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Events;
