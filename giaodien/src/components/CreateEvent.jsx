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
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Lấy danh sách category khi component được mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách category:', error);
        setError('Không thể tải danh sách category!');
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:5000/api/event/create', {
        ...eventData,
        services: [], // Gửi mảng rỗng nếu không có dịch vụ
      });
      alert('Tạo sự kiện thành công!');
      navigate('/eventlist');
    } catch (error) {
      console.error('Lỗi khi tạo sự kiện:', error);
      setError('Không thể tạo sự kiện. Vui lòng thử lại!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-4xl font-bold text-center mb-8 text-purple-600">
          Tạo Sự Kiện
        </h2>

        {error && (
          <p className="text-red-500 bg-red-100 p-2 rounded-lg mb-4">
            {error}
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
              className="bg-purple-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-purple-700 transition-all"
            >
              Tạo Sự Kiện
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
