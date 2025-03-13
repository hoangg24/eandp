import React, { useState, useEffect } from "react";
import {
  getEvents,
  createEvent,
  deleteEvent,
  updateEvent,
} from "../services/eventService";
import { getCategories } from "../services/categoryService";

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    category: "",
    location: "",
  });
  const [editingEventId, setEditingEventId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Unable to load event list!");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Unable to load category list!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingEventId) {
        await updateEvent(editingEventId, {
          ...eventData,
          services: [],
        });
        alert("Event updated successfully!");
      } else {
        await createEvent({
          ...eventData,
          services: [],
        });
        alert("Event added successfully!");
      }
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      alert(
        `Unable to create/update event: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEventData({
      name: event.name,
      date: event.date.split("T")[0], // Format date for input
      category: event.category._id,
      location: event.location,
    });
    setEditingEventId(event._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setLoading(true);
      try {
        await deleteEvent(id);
        alert("Event deleted successfully!");
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Unable to delete event!");
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setEventData({ name: "", date: "", category: "", location: "" });
    setEditingEventId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        {editingEventId ? "Update Event" : "Add Event"}
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 mb-10 transition-all duration-300 hover:shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Name
            </label>
            <input
              type="text"
              placeholder="Enter event name"
              value={eventData.name}
              onChange={(e) =>
                setEventData({ ...eventData, name: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={eventData.date}
              onChange={(e) =>
                setEventData({ ...eventData, date: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={eventData.category}
              onChange={(e) =>
                setEventData({ ...eventData, category: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="Enter location"
              value={eventData.location}
              onChange={(e) =>
                setEventData({ ...eventData, location: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              required
            />
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-400 flex items-center"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                />
              </svg>
            ) : null}
            {editingEventId ? "Update" : "Add"}
          </button>
          {editingEventId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Event List */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">
        Event List
      </h3>
      <div className="bg-white shadow-lg rounded-xl p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              />
            </svg>
          </div>
        ) : error ? (
          <p className="text-center py-8 text-red-600 font-medium">{error}</p>
        ) : events.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {events.map((event) => (
              <li
                key={event._id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 hover:bg-gray-50 transition-all duration-200 rounded-lg px-4"
              >
                <div className="mb-4 md:mb-0">
                  <h4 className="font-semibold text-lg text-gray-800">
                    {event.name}
                  </h4>
                  <p className="text-gray-600">
                    Date: {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    Category: {event.category?.name}
                  </p>
                  <p className="text-gray-600">Location: {event.location}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(event)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all"
                    aria-label="Edit event"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                    aria-label="Delete event"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-8 text-gray-500 italic">
            No events found.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventManagement;