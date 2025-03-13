import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isEditing, setIsEditing] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState(1);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    fetchEventDetails();
    fetchServices();
    fetchCategories();
    fetchUserInfo();
  }, [eventId]);

  const fetchUserInfo = () => {
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("userId");
    setUserRole(role);
    setUserId(id);
  };

  const fetchEventDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/event/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvent(response.data);
      setSelectedCategory(response.data.category); // Set the selected category to the event's category
    } catch (error) {
      console.error("Error fetching event details:", error);
      alert("Unable to load event details!");
      navigate("/eventlist");
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      setCategories(
        response.data.length > 0
          ? response.data
          : [{ _id: "default", name: "No Category" }]
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([{ _id: "default", name: "No Category" }]);
    }
  };

  const canEditEvent = event?.createdBy === userId || userRole === "admin";

  const handleAddService = async () => {
    if (!selectedService || quantity < 1) {
      alert("Please select a service and enter a valid quantity!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/event/${eventId}/add-service`,
        { serviceId: selectedService, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Service added successfully!");
      fetchEventDetails();
      setSelectedService("");
      setQuantity(1);
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to add service!");
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/event/${eventId}/remove-service/${serviceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Service removed successfully!");
      fetchEventDetails();
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to remove service!");
    }
  };

  const handleEditService = async () => {
    if (editingQuantity < 1) {
      alert("Quantity must be greater than 0!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/event/${eventId}/update-service/${isEditing}`,
        { quantity: editingQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Service updated successfully!");
      setIsEditing(null);
      fetchEventDetails();
    } catch (error) {
      console.error("Error editing service:", error);
      alert("Failed to update service!");
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory || selectedCategory === event.category) {
      alert("Category unchanged or invalid!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/event/${eventId}`,
        { category: selectedCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Category updated successfully!");
      fetchEventDetails();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/eventlist")}
          className="mb-8 flex items-center text-indigo-600 hover:text-indigo-800 transition-all duration-300 group"
        >
          <svg
            className="w-6 h-6 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-lg font-medium">Back to Event List</span>
        </button>

        {event ? (
          <>
            {/* Event Details Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform hover:scale-105 transition-all duration-300">
              <h2 className="text-4xl font-extrabold text-indigo-700 mb-6 animate-fade-in">
                {event.name}
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-500"
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
                  <strong>Date:</strong>{" "}
                  <span className="ml-2">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-500"
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
                  <strong>Location:</strong>{" "}
                  <span className="ml-2">{event.location}</span>
                </p>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700"
                >
                  Category:
                </label>
                <select
                  id="category"
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-64 p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {canEditEvent && (
                  <button
                    onClick={handleUpdateCategory}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200"
                  >
                    Update
                  </button>
                )}
              </div>
            </div>

            {/* Add Service Section */}
            {canEditEvent && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform hover:scale-105 transition-all duration-300">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Add a Service
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full sm:flex-1 p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="">Select a Service</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name} - {service.price.toLocaleString()} VND
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value)))
                    }
                    min="1"
                    className="w-24 p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Qty"
                  />
                  <button
                    onClick={handleAddService}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
                  >
                    Add Service
                  </button>
                </div>
              </div>
            )}

            {/* Service List Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                Service List
              </h3>
              {event.services.length > 0 ? (
                <ul className="space-y-6">
                  {event.services.map((s) => (
                    <li
                      key={s._id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-md transform hover:scale-102 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-800">
                            {s.service.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {s.quantity}
                          </p>
                        </div>
                      </div>
                      {canEditEvent && (
                        <div className="flex gap-3">
                          {isEditing === s.service._id ? (
                            <>
                              <input
                                type="number"
                                value={editingQuantity}
                                onChange={(e) =>
                                  setEditingQuantity(
                                    Math.max(1, parseInt(e.target.value))
                                  )
                                }
                                className="w-20 p-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                              />
                              <button
                                onClick={handleEditService}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setIsEditing(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transform hover:scale-105 transition-all duration-200"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setIsEditing(s.service._id);
                                  setEditingQuantity(s.quantity);
                                }}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transform hover:scale-105 transition-all duration-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteService(s.service._id)
                                }
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-200"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12">
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
                  <p className="mt-4 text-gray-500 text-lg">
                    No services added yet.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="animate-spin inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-gray-600 text-lg">
              Loading event details...
            </p>
          </div>
        )}
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

export default EventDetails;
