
import React, { useState, useEffect } from 'react';
import { getEvents, createEvent, deleteEvent } from '../services/eventService';
import { useNavigate } from 'react-router-dom';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState({ name: '', date: '', location: '', services: [] });
    const [service, setService] = useState({ name: '', quantity: 0 });
    const navigate = useNavigate();

    // Lấy danh sách sự kiện
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await getEvents();
            setEvents(data);
        } catch (error) {
            alert('Không thể tải danh sách sự kiện!');
        }
    };

    // Thêm dịch vụ vào danh sách tạm thời
    const handleAddService = () => {
        if (!service.name || service.quantity <= 0) {
            alert('Tên dịch vụ hoặc số lượng không hợp lệ!');
            return;
        }

        setEvent((prev) => ({
            ...prev,
            services: [...prev.services, service],
        }));
        setService({ name: '', quantity: 0 });
    };

    // Xóa dịch vụ khỏi danh sách tạm thời
    const handleDeleteService = (name) => {
        setEvent((prev) => ({
            ...prev,
            services: prev.services.filter((s) => s.name !== name),
        }));
    };

    // Xử lý thêm sự kiện
    const handleAddEvent = async (e) => {
        e.preventDefault();
        try {
            await createEvent(event);
            alert('Thêm sự kiện thành công!');
            setEvent({ name: '', date: '', location: '', services: [] });
            fetchEvents();
        } catch (error) {
            alert('Không thể thêm sự kiện!');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này không?')) {
            try {
                await deleteEvent(id);
                alert('Xóa sự kiện thành công!');
                fetchEvents();
            } catch (error) {
                alert('Không thể xóa sự kiện!');
            }
        }
    };

    const handleNavigateToServices = (id) => {
        navigate(`/events/${id}/services`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
            {/* Tiêu đề */}
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                    Quản lý sự kiện
                </h1>
                <p className="text-xl text-gray-600 mt-4">Thêm, chỉnh sửa và quản lý các sự kiện của bạn</p>
            </div>

            {/* Form thêm sự kiện */}
            <form onSubmit={handleAddEvent} className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto mb-16">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Thêm sự kiện mới</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Tên sự kiện"
                        value={event.name}
                        onChange={(e) => setEvent({ ...event, name: e.target.value })}
                        required
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <input
                        type="date"
                        value={event.date}
                        onChange={(e) => setEvent({ ...event, date: e.target.value })}
                        required
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <input
                        type="text"
                        placeholder="Địa điểm"
                        value={event.location}
                        onChange={(e) => setEvent({ ...event, location: e.target.value })}
                        required
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                </div>

                {/* Dịch vụ */}
                <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-4">Dịch vụ</h3>
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Tên dịch vụ"
                        value={service.name}
                        onChange={(e) => setService({ ...service, name: e.target.value })}
                        className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    <input
                        type="number"
                        placeholder="Số lượng"
                        value={service.quantity}
                        onChange={(e) => setService({ ...service, quantity: parseInt(e.target.value) || 0 })}
                        className="w-24 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    <button
                        type="button"
                        onClick={handleAddService}
                        className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-all"
                    >
                        Thêm
                    </button>
                </div>

                {/* Danh sách dịch vụ */}
                <ul className="space-y-2">
                    {event.services.map((s, index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow"
                        >
                            <span>
                                {s.name} - {s.quantity}
                            </span>
                            <button
                                onClick={() => handleDeleteService(s.name)}
                                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                            >
                                Xóa
                            </button>
                        </li>
                    ))}
                </ul>

                <button
                    type="submit"
                    className="w-full mt-8 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all"
                >
                    Thêm sự kiện
                </button>
            </form>

            {/* Danh sách sự kiện */}
            <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">Danh sách sự kiện</h3>
                <ul className="space-y-4">
                    {events.map((e) => (
                        <li
                            key={e._id}
                            className="bg-white p-6 rounded-xl shadow-lg flex justify-between items-center"
                        >
                            <div>
                                <h4 className="text-xl font-bold">{e.name}</h4>
                                <p className="text-gray-600">
                                    {e.location} - {new Date(e.date).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleNavigateToServices(e._id)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    Quản lý dịch vụ
                                </button>
                                <button
                                    onClick={() => handleDeleteEvent(e._id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Xóa
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default EventManagement;
