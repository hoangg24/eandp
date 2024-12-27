import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InvoiceManagement = () => {
    const [invoices, setInvoices] = useState([]); // Danh sách hóa đơn
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
    const [error, setError] = useState(null); // Trạng thái lỗi
    const navigate = useNavigate();

    useEffect(() => {
        fetchInvoices(); // Lấy danh sách hóa đơn khi component mount
    }, []);

    // Lấy danh sách hóa đơn từ API
    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/invoices', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Gửi token từ localStorage
                },
            });
            setInvoices(response.data); // Gán danh sách hóa đơn từ backend
        } catch (error) {
            setError(
                error.response?.data?.message || 'Không thể tải danh sách hóa đơn! Vui lòng thử lại.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Xem chi tiết hóa đơn
    const handleViewInvoice = (invoiceId) => {
        navigate(`/invoices/${invoiceId}`);
    };

    // Xóa hóa đơn
    const handleDeleteInvoice = async (invoiceId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) return;

        try {
            await axios.delete(`http://localhost:5000/api/invoices/${invoiceId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert('Xóa hóa đơn thành công!');
            setInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice._id !== invoiceId));
        } catch (error) {
            alert('Không thể xóa hóa đơn! Vui lòng thử lại.');
        }
    };

    // Thanh toán MoMo
    const handlePayment = async (invoice) => {
        if (invoice.status === 'Paid') {
            alert('Hóa đơn đã được thanh toán!');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/api/payments/momo/create',
                { invoiceId: invoice._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.data.payUrl) {
                window.location.href = response.data.payUrl; // Redirect đến URL thanh toán
            } else {
                alert('Không thể tạo giao dịch. Vui lòng thử lại sau.');
            }
        } catch (error) {
            alert('Đã xảy ra lỗi khi thanh toán!');
        }
    };

    // Hiển thị giao diện quản lý hóa đơn
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
                                            <button
                                                onClick={() => handlePayment(invoice)}
                                                className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600"
                                            >
                                                Thanh toán
                                            </button>
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

