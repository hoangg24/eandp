import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout'; // Import layout

const InvoiceManagement = () => {
    const [invoices, setInvoices] = useState([]); // Danh sách hóa đơn
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
    const [error, setError] = useState(null); // Trạng thái lỗi
    const navigate = useNavigate();

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:5000/api/invoices');
            setInvoices(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách hóa đơn:', error);
            setError('Không thể tải danh sách hóa đơn!');
        } finally {
            setLoading(false);
        }
    };

    const handleViewInvoice = (invoiceId) => {
        navigate(`/invoices/${invoiceId}`);
    };

    const handleDeleteInvoice = async (invoiceId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
            try {
                await axios.delete(`http://localhost:5000/api/invoices/${invoiceId}`);
                alert('Xóa hóa đơn thành công!');
                fetchInvoices(); // Cập nhật danh sách sau khi xóa
            } catch (error) {
                console.error('Lỗi khi xóa hóa đơn:', error);
                alert('Không thể xóa hóa đơn! Vui lòng thử lại.');
            }
        }
    };

    return (
      
            <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-10 text-purple-600">
                        Quản Lý Hóa Đơn
                    </h2>
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        {loading ? (
                            <p className="text-center py-6 text-gray-600">Đang tải...</p>
                        ) : error ? (
                            <p className="text-center py-6 text-red-600">{error}</p>
                        ) : invoices.length > 0 ? (
                            <table className="table-auto w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-purple-200 text-gray-800">
                                        <th className="border px-6 py-3">Mã Hóa Đơn</th>
                                        <th className="border px-6 py-3">Tên Sự Kiện</th>
                                        <th className="border px-6 py-3">Tổng Tiền</th>
                                        <th className="border px-6 py-3">Trạng Thái</th>
                                        <th className="border px-6 py-3">Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((invoice) => (
                                        <tr
                                            key={invoice._id}
                                            className="text-center hover:bg-purple-50 transition-all"
                                        >
                                            <td className="border px-6 py-4">{invoice._id}</td>
                                            <td className="border px-6 py-4">
                                                {invoice.event?.name || 'Không xác định'}
                                            </td>
                                            <td className="border px-6 py-4">
                                                {invoice.totalAmount?.toLocaleString() || 0} VND
                                            </td>
                                            <td className="border px-6 py-4">
                                                {invoice.status || 'N/A'}
                                            </td>
                                            <td className="border px-6 py-4 flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewInvoice(invoice._id)}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                                >
                                                    Xem Chi Tiết
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteInvoice(invoice._id)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
                                                >
                                                    Xóa
                                                </button>
                                                {invoice.status === 'Pending' && (
                                                    <button
                                                        className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600"
                                                    >
                                                        Thanh toán
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center py-6 text-gray-600 italic">
                                Không có hóa đơn nào.
                            </p>
                        )}
                    </div>
                </div>
            </div>
  
    );
};

export default InvoiceManagement;
