import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/event');
      setEvents(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách sự kiện:', error);
      alert('Không thể tải danh sách sự kiện!');
    }
  };

  const handleNavigateToInvoiceDetails = (eventId) => {
    navigate(`/events/${eventId}/invoices`);
  };

  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-10 text-purple-600">Danh Sách Sự Kiện</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          {events.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {events.map((event) => (
                <li
                  key={event._id}
                  className="flex justify-between items-center py-4 hover:bg-gray-50 transition-all duration-200 rounded-lg px-4"
                >
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{event.name}</h3>
                    <p className="text-gray-600">Ngày: {new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-gray-600">Địa điểm: {event.location}</p>
                  </div>
                  <div className="flex gap-4">
                    {/* Nút tạo hóa đơn */}
                    <button
                      onClick={() => handleNavigateToInvoiceDetails(event._id)}
                      className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-600 transition-all"
                    >
                      Tạo Hóa Đơn
                    </button>
                    {/* Nút xem chi tiết sự kiện */}
                    <button
                      onClick={() => handleViewDetails(event._id)}
                      className="bg-yellow-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-yellow-600 transition-all"
                    >
                      Xem Chi Tiết
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center">Không có sự kiện nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventList;
