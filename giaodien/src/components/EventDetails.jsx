import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isEditing, setIsEditing] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState(1);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');

  // Fetch data khi component được load
  useEffect(() => {
    fetchEventDetails();
    fetchServices();
    fetchCategories();
    fetchUserInfo();
  }, [eventId]);

  // Lấy thông tin người dùng từ localStorage
  const fetchUserInfo = () => {
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('userId');
    setUserRole(role);
    setUserId(id);
  };

  // Lấy chi tiết sự kiện
  const fetchEventDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setEvent(response.data);
  
      // Gán selectedCategory từ event.category, nếu không tồn tại, gán giá trị rỗng
      const matchedCategory = categories.find((cat) => cat._id === response.data.category);
      setSelectedCategory(matchedCategory ? matchedCategory._id : '');
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết sự kiện:', error);
      alert('Không thể tải chi tiết sự kiện!');
      navigate('/eventlist');
    }
  };

  // Lấy danh sách dịch vụ
  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách dịch vụ:', error);
    }
  };

  // Lấy danh sách danh mục
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      if (response.data.length === 0) {
        setCategories([{ _id: 'default', name: 'Không có danh mục' }]);
      } else {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách danh mục:', error);
      setCategories([{ _id: 'default', name: 'Không có danh mục' }]); // Fallback nếu xảy ra lỗi
    }
  };

  // Kiểm tra quyền chỉnh sửa
  const canEditEvent = event?.createdBy === userId || userRole === 'admin';

  // Xử lý thêm dịch vụ
  const handleAddService = async () => {
    if (!selectedService || quantity < 1) {
      alert('Vui lòng chọn dịch vụ và nhập số lượng hợp lệ!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/event/${eventId}/add-service`,
        {
          serviceId: selectedService,
          quantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Dịch vụ đã được thêm vào sự kiện!');
      await fetchEventDetails();
    } catch (error) {
      console.error('Lỗi khi thêm dịch vụ:', error);
      alert('Không thể thêm dịch vụ!');
    }
  };

  // Xử lý xóa dịch vụ
  const handleDeleteService = async (serviceId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/event/${eventId}/remove-service/${serviceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Dịch vụ đã được xóa!');
      fetchEventDetails();
    } catch (error) {
      console.error('Lỗi khi xóa dịch vụ:', error);
      alert('Không thể xóa dịch vụ!');
    }
  };

  // Xử lý sửa dịch vụ
  const handleEditService = async () => {
    if (editingQuantity < 1) {
      alert('Số lượng phải lớn hơn 0!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/event/${eventId}/update-service/${isEditing}`,
        { quantity: editingQuantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Số lượng dịch vụ đã được cập nhật!');
      setIsEditing(null);
      fetchEventDetails();
    } catch (error) {
      console.error('Lỗi khi sửa dịch vụ:', error);
      alert('Không thể sửa dịch vụ!');
    }
  };

  // Xử lý cập nhật danh mục
  const handleUpdateCategory = async () => {
    if (!selectedCategory || selectedCategory === event.category) {
      alert('Danh mục không thay đổi hoặc không hợp lệ!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/event/${eventId}`,
        { category: selectedCategory },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Danh mục đã được cập nhật!');
      await fetchEventDetails(); // Đồng bộ lại trạng thái sau khi cập nhật
    } catch (error) {
      console.error('Lỗi khi cập nhật danh mục:', error);
      alert('Không thể cập nhật danh mục!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate('/eventlist')}
          className="bg-blue-500 text-white px-6 py-2 mb-6 rounded-full shadow-md hover:bg-blue-600 transition-all"
        >
          Trở về danh sách sự kiện
        </button>

        {event ? (
          <>
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-3xl font-bold text-purple-600 mb-4">{event.name}</h2>
              <p className="text-gray-600">
                <strong>Ngày:</strong> {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <strong>Địa điểm:</strong> {event.location}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <label htmlFor="category" className="font-medium text-gray-700">
                  Danh mục:
                </label>
                  <select
                    id="category"
                    value={selectedCategory || ''} // Đảm bảo giá trị không null
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 p-2 rounded flex-grow"
                    >
                    <option value="" disabled>-- Chọn danh mục --</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                {canEditEvent && (
                  <button
                    onClick={handleUpdateCategory}
                    className="bg-green-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-600 transition-all"
                  >
                    Cập nhật
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">Thêm Dịch Vụ</h3>
              <div className="flex gap-4 items-center">
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="border border-gray-300 p-2 rounded flex-grow"
                >
                  <option value="">-- Chọn Dịch Vụ --</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name} - {service.price.toLocaleString()} VND
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                  min="1"
                  className="border border-gray-300 p-2 w-20 rounded"
                  placeholder="Số lượng"
                />
                {canEditEvent && (
                  <button
                    onClick={handleAddService}
                    className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-600 transition-all"
                  >
                    Thêm
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">Danh Sách Dịch Vụ</h3>
              {event.services.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {event.services.map((s) => (
                    <li key={s._id} className="flex justify-between items-center py-4">
                      <div>
                        <p className="text-gray-800 font-semibold">{s.service.name}</p>
                        <p className="text-gray-600">Số lượng: {s.quantity}</p>
                      </div>
                      {canEditEvent && (
                        <div className="flex gap-4">
                          {isEditing === s.service._id ? (
                            <>
                              <input
                                type="number"
                                value={editingQuantity}
                                onChange={(e) => setEditingQuantity(parseInt(e.target.value, 10))}
                                className="border border-gray-300 p-2 w-20 rounded"
                              />
                              <button
                                onClick={handleEditService}
                                className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 transition-all"
                              >
                                Lưu
                              </button>
                              <button
                                onClick={() => setIsEditing(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 transition-all"
                              >
                                Hủy
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setIsEditing(s.service._id);
                                  setEditingQuantity(s.quantity);
                                }}
                                className="bg-yellow-500 text-white px-4 py-2 rounded shadow-md hover:bg-yellow-600 transition-all"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteService(s.service._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 transition-all"
                              >
                                Xóa
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Chưa có dịch vụ nào được thêm.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">Đang tải chi tiết sự kiện...</p>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
