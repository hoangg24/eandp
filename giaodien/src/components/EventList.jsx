import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchEvents();
  }, []);

  const fetchUserInfo = () => {
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("userId");
    setUserRole(role);
    setUserId(id);
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/event", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Unable to load event list!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (eventId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/event/${eventId}`,
        { isPublic: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, isPublic: response.data.event.isPublic }
            : event
        )
      );
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating event status:", error);
      alert(error.response?.data?.message || "Unable to update event status.");
    }
  };

  const handleNavigateToInvoiceDetails = (eventId) => {
    navigate(`/events/${eventId}/invoices`);
  };

  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-indigo-700 mb-10 text-center animate-fade-in">
          Event List
        </h2>

        {/* Event List Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
              <p className="ml-4 text-lg text-gray-600">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4 text-lg text-red-600 font-medium">{error}</p>
            </div>
          ) : events.length > 0 ? (
            <ul className="space-y-6">
              {events.map((event) => (
                <li
                  key={event._id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-md transform hover:scale-102 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4 md:mb-0">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {event.name}
                      </h3>
                      <p className="text-gray-600 flex items-center mt-1">
                        <svg
                          className="w-5 h-5 mr-2 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 flex items-center mt-1">
                        <svg
                          className="w-5 h-5 mr-2 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 12.414a2 2 0 10-2.828-2.828L6.343 13.657a6 6 0 108.314 8.314z"
                          />
                        </svg>
                        {event.location}
                      </p>
                      <p
                        className={`mt-2 text-sm font-medium px-2 py-1 rounded-full inline-block ${
                          event.isPublic
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {event.isPublic ? "Public" : "Private"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-col md:flex-row">
                    {userRole === "admin" || event.createdBy?.toString() === userId ? (
                      <>
                        <button
                          onClick={() =>
                            handleNavigateToInvoiceDetails(event._id)
                          }
                          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
                          aria-label="Create invoice"
                        >
                          Create Invoice
                        </button>
                        <button
                          onClick={() => handleViewDetails(event._id)}
                          className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 transform hover:scale-105 transition-all duration-200"
                          aria-label="View event details"
                        >
                          View Details
                        </button>
                        {(userRole === "admin" ||
                          event.createdBy?.toString() === userId) && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(event._id, event.isPublic)
                            }
                            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200"
                            aria-label={
                              event.isPublic ? "Make private" : "Make public"
                            }
                          >
                            {event.isPublic ? "Make Private" : "Make Public"}
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleViewDetails(event._id)}
                          className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 transform hover:scale-105 transition-all duration-200"
                          aria-label="View event details"
                        >
                          View Details
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-4 text-lg text-gray-500 italic">
                No events found.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default EventList;
