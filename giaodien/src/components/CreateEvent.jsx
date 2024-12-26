import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const [categories, setCategories] = useState([]); // Danh sách Category
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    category: '', // ID của Category
    location: '',
  });
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState(''); // Trạng thái lỗi
  const [successMessage, setSuccessMessage] = useState(''); // Thông báo thành công
  const navigate = useNavigate();

  // Lấy danh sách category khi component được mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        const response = await axios.get('http://localhost:5000/api/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách category:', error);
        setError('Không thể tải danh sách category!');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      await axios.post(
        'http://localhost:5000/api/event/create',
        {
          ...eventData,
          services: [], // Gửi mảng rỗng nếu không có dịch vụ
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage('Tạo sự kiện thành công!');
      setTimeout(() => {
        navigate('/eventlist');
      }, 1500); // Chuyển hướng sau 1.5 giây
    } catch (error) {
      console.error('Lỗi khi tạo sự kiện:', error);
      setError(
        error.response?.data?.message || 'Không thể tạo sự kiện. Vui lòng thử lại!'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-4xl font-bold text-center mb-8 text-purple-600">
          Tạo Sự Kiện
        </h2>

        {/* Hiển thị trạng thái lỗi hoặc thành công */}
        {error && (
          <p className="text-red-500 bg-red-100 p-2 rounded-lg mb-4">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="text-green-500 bg-green-100 p-2 rounded-lg mb-4">
            {successMessage}
          </p>
        )}

        {/* Hiển thị thông báo đang tải */}
        {loading && (
          <p className="text-blue-500 bg-blue-100 p-2 rounded-lg mb-4">
            Đang xử lý, vui lòng chờ...
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8"
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tên sự kiện"
              value={eventData.name}
              onChange={(e) =>
                setEventData({ ...eventData, name: e.target.value })
              }
              required
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <input
              type="date"
              value={eventData.date}
              onChange={(e) =>
                setEventData({ ...eventData, date: e.target.value })
              }
              required
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            />

            {/* Dropdown chọn Category */}
            <select
              value={eventData.category}
              onChange={(e) =>
                setEventData({ ...eventData, category: e.target.value })
              }
              required
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="" disabled>
                Chọn danh mục
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Địa điểm"
              value={eventData.location}
              onChange={(e) =>
                setEventData({ ...eventData, location: e.target.value })
              }
              required
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={loading} // Vô hiệu hóa khi đang tải
              className={`px-6 py-3 rounded-full shadow-md transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {loading ? 'Đang xử lý...' : 'Tạo Sự Kiện'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
