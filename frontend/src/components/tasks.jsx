import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import style from '../style/tasks.module.css';

function Tasks() {
    const { eventId,eventName } = useParams(); // Get eventId from the URL
    const [tasks, setTasks] = useState([]); // State to store tasks
    const [attendees, setAttendees] = useState([]); // State to store attendees
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [error, setError] = useState(null); // State to store errors
    const [showPopup, setShowPopup] = useState(false); // State to toggle Add Task popup
    const [newTask, setNewTask] = useState({ name: '', deadline: '', status: 'Pending', AttendeeId: '' }); // State for new task input

    // Fetch tasks and attendees for the given eventId
    useEffect(() => {
        const fetchTasksAndAttendees = async () => {
            try {
                // Fetch tasks for the given event
                const taskResponse = await fetch(`http://localhost:5000/api/tasks/event/${eventId}`);
                if (!taskResponse.ok) throw new Error('Failed to fetch tasks');
                const taskData = await taskResponse.json();
                setTasks(taskData);

                // Fetch attendees for the given event
                const attendeeResponse = await fetch(`http://localhost:5000/api/attendees/${eventId}`);
                if (!attendeeResponse.ok) throw new Error('Failed to fetch attendees');
                const attendeeData = await attendeeResponse.json();
                setAttendees(attendeeData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTasksAndAttendees();
    }, [eventId]); // Dependency array ensures this runs when eventId changes

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission to add a new task
    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const taskToAdd = { ...newTask, eventId }; // Include the eventId in the task data
            console.log(taskToAdd)
            const response = await fetch(`http://localhost:5000/api/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskToAdd),
            });

            if (response.ok) {
                const addedTask = await response.json();
                setTasks((prevTasks) => [...prevTasks, addedTask]); // Add new task to the task list
                setShowPopup(false); // Close the popup
                setNewTask({ name: '', deadline: '', status: 'Pending', AttendeeId: '' }); // Reset the form
            } else {
                throw new Error('Failed to add task');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className={style.tasksContainer}>
            <h1>Tasks for Event: {eventName}</h1>

            {loading && <p>Loading tasks...</p>}
            {error && <p className={style.error}>Error: {error}</p>}

            {!loading && !error && tasks.length === 0 && (
                <p>No tasks found for this event.</p>
            )}

            {!loading && !error && tasks.length > 0 && (
                <ul className={style.taskList}>
                    {tasks.map((task) => (
                        <li key={task._id} className={style.taskItem}>
                            <h3>{task.name}</h3>
                            <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleString()}</p>
                            <p><strong>Status:</strong> {task.status}</p>
                            <p>
                                <strong>Assigned Attendee:</strong>{' '}
                                {attendees.find((attendee) => attendee._id === task.AttendeeId)?.name || 'Unassigned'}
                            </p>
                        </li>
                    ))}
                </ul>
            )}

            {/* Button to open Add Task popup */}
            <button className={style.addTaskButton} onClick={() => setShowPopup(true)}>
                Add Task
            </button>

            {/* Popup for adding a new task */}
            {showPopup && (
                <div className={style.popup}>
                    <div className={style.popupContent}>
                        <h2>Add New Task</h2>
                        <form onSubmit={handleAddTask}>
                            <label>
                                Task Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={newTask.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                Deadline:
                                <input
                                    type="datetime-local"
                                    name="deadline"
                                    value={newTask.deadline}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                Status:
                                <select
                                    name="status"
                                    value={newTask.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </label>
                            <label>
                                Assigned Attendee:
                                <select
                                    name="AttendeeId"
                                    value={newTask.AttendeeId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Unassigned</option>
                                    {attendees.map((attendee) => (
                                        <option key={attendee._id} value={attendee._id}>
                                            {attendee.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <div className={style.popupActions}>
                                <button type="submit">Add Task</button>
                                <button type="button" onClick={() => setShowPopup(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tasks;
