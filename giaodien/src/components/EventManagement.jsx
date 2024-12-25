import React, { useState, useEffect } from 'react';
import {
  getEvents,
  createEvent,
  deleteEvent,
  updateEvent,
} from '../services/eventService';
import { getCategories } from '../services/categoryService'; // Import category service
import AdminLayout from '../components/AdminLayout'; // Import AdminLayout

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]); // State to store categories
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    category: '',
    location: '',
  });
  const [editingEventId, setEditingEventId] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchCategories(); // Fetch categories
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sự kiện:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách danh mục:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log('Dữ liệu trước khi gửi:', eventData);
        if (editingEventId) {
            await updateEvent(editingEventId, {
                ...eventData,
                services: [],
            });
            alert('Cập nhật sự kiện thành công!');
        } else {
            await createEvent({
                ...eventData,
                services: [],
            });
            alert('Thêm sự kiện thành công!');
        }
        resetForm();
        fetchEvents();
    } catch (error) {
        console.error('Lỗi chi tiết:', error.response?.data || error.message);
        alert('Không thể tạo/cập nhật sự kiện! Vui lòng kiểm tra lại.');
    }
};


  const handleEdit = (event) => {
    setEventData({
      name: event.name,
      date: event.date.split('T')[0],
      category: event.category,
      location: event.location,
    });
    setEditingEventId(event._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này không?')) {
      try {
        await deleteEvent(id);
        alert('Xóa sự kiện thành công!');
        fetchEvents();
      } catch (error) {
        console.error('Lỗi khi xóa sự kiện:', error);
      }
    }
  };

  const resetForm = () => {
    setEventData({ name: '', date: '', category: '', location: '' });
    setEditingEventId(null);
  };

  return (
   
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-purple-600">
          {editingEventId ? 'Cập nhật Sự Kiện' : 'Thêm Sự Kiện'}
        </h2>

        {/* Form thêm/cập nhật sự kiện */}
        <form
          onSubmit={handleSubmit}
          className="mb-10 bg-white shadow-md rounded p-6"
        >
          <input
            type="text"
            placeholder="Tên sự kiện"
            value={eventData.name}
            onChange={(e) =>
              setEventData({ ...eventData, name: e.target.value })
            }
            className="border border-gray-300 p-3 mb-4 w-full rounded"
            required
          />
          <input
            type="date"
            value={eventData.date}
            onChange={(e) =>
              setEventData({ ...eventData, date: e.target.value })
            }
            className="border border-gray-300 p-3 mb-4 w-full rounded"
            required
          />
          <select
            value={eventData.category}
            onChange={(e) =>
              setEventData({ ...eventData, category: e.target.value })
            }
            className="border border-gray-300 p-3 mb-4 w-full rounded"
            required
          >
            <option value="">-- Chọn Thể Loại --</option>
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
            className="border border-gray-300 p-3 mb-6 w-full rounded"
            required
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-600 transition-all"
            >
              {editingEventId ? 'Cập nhật' : 'Thêm'}
            </button>
            {editingEventId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-gray-600 transition-all"
              >
                Hủy
              </button>
            )}
          </div>
        </form>

        {/* Danh sách sự kiện */}
        <h3 className="text-2xl font-bold text-gray-700 mb-4">
          Danh Sách Sự Kiện
        </h3>
        <div className="bg-white shadow-md rounded-lg p-6">
          {events.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {events.map((e) => (
                <li
                  key={e._id}
                  className="flex justify-between items-center py-4 hover:bg-gray-50 transition-all duration-200 rounded-lg px-4"
                >
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">{e.name}</h4>
                    <p className="text-gray-600">
                      Ngày: {new Date(e.date).toLocaleDateString()}
                    </p>
                    {/* <p className="text-gray-600">Thể loại: {e.category}</p> */}
                    <p className="text-gray-600">Địa điểm: {e.location}</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEdit(e)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-yellow-600 transition-all"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(e._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-600 transition-all"
                    >
                      Xóa
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center">Không có sự kiện nào.</p>
          )}
        </div>
      </div>
  
  );
};

export default EventManagement;
