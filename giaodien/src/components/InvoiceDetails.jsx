import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const InvoiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(''); // Trạng thái mới

    useEffect(() => {
        fetchInvoiceDetails();
    }, []);

    const fetchInvoiceDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/invoices/${id}`);
            setInvoice(response.data);
            setStatus(response.data.status); // Gán trạng thái hiện tại
            setLoading(false);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết hóa đơn:', error);
            alert('Không thể tải chi tiết hóa đơn!');
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        try {
            await axios.put(`http://localhost:5000/api/invoices/${id}`, {
                status,
            });
            alert('Cập nhật trạng thái hóa đơn thành công!');
            fetchInvoiceDetails(); // Refresh chi tiết hóa đơn
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái hóa đơn:', error);
            alert('Không thể cập nhật trạng thái hóa đơn!');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-4xl font-bold text-center mb-10 text-purple-600">
                    Chi Tiết Hóa Đơn
                </h2>

                {loading ? (
                    <p className="text-center text-gray-600">Đang tải chi tiết hóa đơn...</p>
                ) : invoice ? (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        {/* Thông tin sự kiện */}
                        <div className="mb-6">
                            <h3 className="font-bold text-2xl text-gray-800">
                                Sự Kiện: {invoice.event.name}
                            </h3>
                            <p className="text-gray-600">
                                Ngày: {new Date(invoice.event.date).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600">
                                Địa Điểm: {invoice.event.location}
                            </p>
                        </div>

                        {/* Chi tiết dịch vụ */}
                        <h4 className="text-xl font-bold text-gray-700 mb-4">Chi Tiết Dịch Vụ:</h4>
                        <ul className="divide-y divide-gray-200">
                            {invoice.services.map((service) => (
                                <li
                                    key={service.service._id}
                                    className="flex justify-between items-center py-4 px-2 hover:bg-gray-50 rounded-lg"
                                >
                                    <span>{service.service.name}</span>
                                    <span>
                                        {service.quantity} x{' '}
                                        {service.price.toLocaleString()} VND
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* Trạng thái hóa đơn */}
                        <h4 className="mt-6 text-lg font-bold text-gray-700">Trạng Thái:</h4>
                        <select
                            className="mt-2 p-2 border rounded w-full"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Canceled">Canceled</option>
                        </select>

                        {/* Tổng tiền */}
                        <h3 className="text-xl font-bold text-purple-600 mt-6">
                            Tổng Tiền: {invoice.totalAmount.toLocaleString()} VND
                        </h3>

                        {/* Nút hành động */}
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={() => navigate('/invoices')}
                                className="bg-gray-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-gray-600 transition-all"
                            >
                                Trở Về Danh Sách Hóa Đơn
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-600 transition-all"
                            >
                                Cập Nhật Trạng Thái
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-red-500">Không tìm thấy hóa đơn!</p>
                )}
            </div>
        </div>
    );
};

export default InvoiceDetails;
