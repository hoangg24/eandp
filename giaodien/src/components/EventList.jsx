import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchEvents();
  }, []);

  // Lấy thông tin vai trò và ID người dùng từ localStorage
  const fetchUserInfo = () => {
    const role = localStorage.getItem('role'); // Vai trò: 'admin' hoặc 'user'
    const id = localStorage.getItem('userId'); // ID của người dùng
    setUserRole(role);
    setUserId(id);
  };

  // Lấy danh sách sự kiện từ API
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token'); // Token cho API
      const response = await axios.get('http://localhost:5000/api/event', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(response.data); // Lưu danh sách sự kiện
    } catch (error) {
      console.error('Lỗi khi tải danh sách sự kiện:', error);
      alert('Không thể tải danh sách sự kiện!');
    }
  };

  // Cập nhật trạng thái sự kiện (công khai/riêng tư)
  const handleUpdateStatus = async (eventId, currentStatus) => {
    try {
      const token = localStorage.getItem('token'); // Token cho API
      const response = await axios.put(
        `http://localhost:5000/api/event/${eventId}`,
        { isPublic: !currentStatus }, // Đảo ngược trạng thái hiện tại
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Dữ liệu trả về từ backend:', response.data);

      // Cập nhật danh sách sự kiện
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, isPublic: response.data.event.isPublic }
            : event
        )
      );

      alert('Cập nhật trạng thái thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái sự kiện:', error);

      // Hiển thị thông báo lỗi chi tiết nếu có từ backend
      if (error.response && error.response.data) {
        alert(error.response.data.message || 'Không thể cập nhật trạng thái sự kiện.');
      } else {
        alert('Không thể kết nối đến server. Vui lòng thử lại!');
      }
    }
  };

  // Điều hướng đến trang hóa đơn chi tiết
  const handleNavigateToInvoiceDetails = (eventId) => {
    navigate(`/events/${eventId}/invoices`);
  };

  // Điều hướng đến trang chi tiết sự kiện
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
              {events.map((event) => {
                console.log('Event:', event);
                console.log('UserId:', userId);
                console.log('UserRole:', userRole);

                return (
                  <li
                    key={event._id}
                    className="flex justify-between items-center py-4 hover:bg-gray-50 transition-all duration-200 rounded-lg px-4"
                  >
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{event.name}</h3>
                      <p className="text-gray-600">Ngày: {new Date(event.date).toLocaleDateString()}</p>
                      <p className="text-gray-600">Địa điểm: {event.location}</p>
                      {event.isPublic ? (
                        <p className="text-green-500 font-semibold">Công khai</p>
                      ) : (
                        <p className="text-red-500 font-semibold">Riêng tư</p>
                      )}
                    </div>

                    <div className="flex gap-4">
                      {/* Hiển thị nút nếu người dùng có quyền */}
                      {userRole === 'admin' || event.isPublic || event.createdBy?.toString() === userId ? (
                        <>
                          <button
                            onClick={() => handleNavigateToInvoiceDetails(event._id)}
                            className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-600 transition-all"
                          >
                            Tạo Hóa Đơn
                          </button>
                          <button
                            onClick={() => handleViewDetails(event._id)}
                            className="bg-yellow-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-yellow-600 transition-all"
                          >
                            Xem Chi Tiết
                          </button>
                          {/* Chỉ người tạo hoặc admin thấy nút cập nhật trạng thái */}
                          {(userRole === 'admin' || event.createdBy?.toString() === userId) && (
                            <button
                              onClick={() => handleUpdateStatus(event._id, event.isPublic)}
                              className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-600 transition-all"
                            >
                              {event.isPublic ? 'Riêng tư' : 'Công khai'}
                            </button>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500 italic">Bạn không có quyền xem chi tiết</p>
                      )}
                    </div>
                  </li>
                );
              })}
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
