import React, { useState, useEffect } from 'react';
import { getServices, addService, deleteService } from '../services/serviceService';
import { useParams, useNavigate } from 'react-router-dom';

const ServiceManagement = () => {
    const { eventId } = useParams();
    const [services, setServices] = useState([]);
    const [service, setService] = useState({ name: '', quantity: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const data = await getServices(eventId);
            setServices(data);
        } catch (error) {
            alert('Không thể tải danh sách dịch vụ!');
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            await addService(eventId, service);
            alert('Thêm dịch vụ thành công!');
            setService({ name: '', quantity: 0 });
            fetchServices();
        } catch (error) {
            alert('Không thể thêm dịch vụ!');
        }
    };

    const handleDeleteService = async (serviceName) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${serviceName}" không?`)) {
            try {
                await deleteService(eventId, serviceName);
                alert('Xóa dịch vụ thành công!');
                fetchServices();
            } catch (error) {
                alert('Không thể xóa dịch vụ!');
            }
        }
    };

    const handleNavigateToDetails = (serviceName) => {
        navigate(`/events/${eventId}/${serviceName}/details`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                    Quản lý dịch vụ
                </h1>
                <p className="text-lg text-gray-600 mt-4">
                    Thêm, xóa, và quản lý các dịch vụ trong sự kiện
                </p>
            </div>

            {/* Form thêm dịch vụ */}
            <form
                onSubmit={handleAddService}
                className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto mb-16"
            >
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Thêm dịch vụ mới</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Tên dịch vụ"
                        value={service.name}
                        onChange={(e) => setService({ ...service, name: e.target.value })}
                        required
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <input
                        type="number"
                        placeholder="Số lượng"
                        value={service.quantity}
                        onChange={(e) => setService({ ...service, quantity: parseInt(e.target.value) || 0 })}
                        required
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all"
                >
                    Thêm dịch vụ
                </button>
            </form>

            {/* Danh sách dịch vụ */}
            <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">Danh sách dịch vụ</h3>
                <ul className="space-y-4">
                    {services.map((s, index) => (
                        <li
                            key={index}
                            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                        >
                            <div>
                                <h4 className="text-lg font-bold">{s.name}</h4>
                                <p className="text-gray-600">Số lượng: {s.quantity}</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleNavigateToDetails(s.name)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                >
                                    Quản lý chi tiết
                                </button>
                                <button
                                    onClick={() => handleDeleteService(s.name)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
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

export default ServiceManagement;
