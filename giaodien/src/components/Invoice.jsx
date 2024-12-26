import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Invoice = () => {
  const { eventId } = useParams(); // ID sự kiện
  const navigate = useNavigate();
  const [event, setEvent] = useState(null); // Lưu thông tin sự kiện
  const [invoice, setInvoice] = useState(null); // Lưu thông tin hóa đơn tạm thời
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [canCreateInvoice, setCanCreateInvoice] = useState(false); // Quyền tạo hóa đơn

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const eventData = response.data;
      setEvent(eventData);

      // Tạm tính hóa đơn (chưa lưu vào DB)
      const tempInvoice = {
        event: {
          name: eventData.name,
          date: eventData.date,
          location: eventData.location,
        },
        services: eventData.services.map((service) => ({
          name: service.service.name,
          price: service.service.price,
          quantity: service.quantity,
        })),
        totalAmount: eventData.services.reduce(
          (total, service) => total + service.service.price * service.quantity,
          0
        ),
      };

      setInvoice(tempInvoice);

      // Kiểm tra quyền tạo hóa đơn
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('role');
      const hasPermission =
        userRole === 'admin' || eventData.isPublic || eventData.createdBy === userId;

      setCanCreateInvoice(hasPermission);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết sự kiện:', error);
      alert('Không thể tải chi tiết sự kiện!');
      setLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/invoices/create',
        { eventId }, // Gửi ID sự kiện
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Hóa đơn đã được tạo thành công!');
      navigate('/eventlist'); // Chuyển hướng tới danh sách sự kiện
    } catch (error) {
      console.error('Lỗi khi tạo hóa đơn:', error);
      alert('Không thể tạo hóa đơn!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-10 text-purple-600">
          Chi Tiết Hóa Đơn Tạm Thời
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Đang tải...</p>
        ) : event && invoice ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            {/* Thông tin sự kiện */}
            <div className="mb-6">
              <h3 className="font-bold text-xl text-gray-800">{invoice.event.name}</h3>
              <p className="text-gray-600">
                Ngày: {new Date(invoice.event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">Địa điểm: {invoice.event.location}</p>
            </div>

            {/* Chi tiết dịch vụ */}
            <h4 className="font-bold text-lg text-gray-700">Dịch Vụ:</h4>
            <ul className="divide-y divide-gray-200 mt-4">
              {invoice.services.map((service, index) => (
                <li
                  key={index}
                  className="flex justify-between py-4 hover:bg-gray-50 transition-all duration-200 rounded-lg px-4"
                >
                  <span>{service.name}</span>
                  <span>
                    {service.quantity} x {service.price.toLocaleString()} VND
                  </span>
                </li>
              ))}
            </ul>

            {/* Tổng tiền */}
            <h4 className="font-bold text-xl text-purple-600 mt-6">
              Tổng Tiền: {invoice.totalAmount.toLocaleString()} VND
            </h4>

            {/* Nút hành động */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => navigate('/eventlist')}
                className="bg-gray-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-gray-600 transition-all"
              >
                Trở về
              </button>
              {canCreateInvoice ? (
                <button
                  onClick={handleCreateInvoice}
                  className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-600 transition-all"
                >
                  Tạo Hóa Đơn Chính Thức
                </button>
              ) : (
                <p className="text-gray-600 italic">
                  Bạn không có quyền tạo hóa đơn cho sự kiện này.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">Không tìm thấy thông tin hóa đơn.</p>
        )}
      </div>
    </div>
  );
};

export default Invoice;
