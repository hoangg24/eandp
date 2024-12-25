import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout'; // Import layout

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
  }); // Dữ liệu của form
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [editingUserId, setEditingUserId] = useState(null); // ID của người dùng đang chỉnh sửa

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Sử dụng token nếu cần
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Không thể tải danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Xóa người dùng
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        alert('Xóa người dùng thành công!');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Không thể xóa người dùng!');
      }
    }
  };

  // Chặn/Mở Chặn người dùng
  const handleToggleBlockUser = async (userId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/block/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert(response.data.message);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user block:', error);
      alert('Không thể thay đổi trạng thái chặn/mở chặn người dùng!');
    }
  };

  // Thêm hoặc cập nhật người dùng
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Cập nhật người dùng
        await axios.put(`http://localhost:5000/api/users/${editingUserId}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        alert('Cập nhật thông tin người dùng thành công!');
      } else {
        // Thêm mới người dùng
        await axios.post('http://localhost:5000/api/users', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        alert('Thêm người dùng mới thành công!');
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Không thể lưu thông tin người dùng!');
    }
  };

  // Bắt đầu chỉnh sửa người dùng
  const handleEditUser = (user) => {
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setIsEditing(true);
    setEditingUserId(user._id);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ username: '', email: '', role: 'user' });
    setIsEditing(false);
    setEditingUserId(null);
  };

  return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold text-purple-600 mb-6 text-center">
          Quản Lý Người Dùng
        </h1>

        {/* Form Thêm/Sửa Người Dùng */}
        <form onSubmit={handleSubmitForm} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {isEditing ? 'Cập Nhật Người Dùng' : 'Thêm Người Dùng'}
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tên Người Dùng</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full border-gray-300 rounded-lg p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border-gray-300 rounded-lg p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Vai Trò</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full border-gray-300 rounded-lg p-2"
            >
              <option value="user">Người Dùng</option>
              <option value="admin">Quản Trị Viên</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              {isEditing ? 'Cập Nhật' : 'Thêm Mới'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Hủy
              </button>
            )}
          </div>
        </form>

        {/* Danh Sách Người Dùng */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {loading ? (
            <p className="text-center py-6 text-gray-600">Đang tải...</p>
          ) : error ? (
            <p className="text-center py-6 text-red-600">{error}</p>
          ) : users.length > 0 ? (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-purple-100 text-left">
                  <th className="py-2 px-4 border-b">Tên Người Dùng</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Vai Trò</th>
                  <th className="py-2 px-4 border-b">Trạng Thái</th>
                  <th className="py-2 px-4 border-b">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{user.username}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{user.role}</td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`px-2 py-1 rounded ${
                          user.isBlocked
                            ? 'bg-red-100 text-red-600'
                            : 'bg-green-100 text-green-600'
                        }`}
                      >
                        {user.isBlocked ? 'Bị Chặn' : 'Hoạt Động'}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b flex gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleToggleBlockUser(user._id)}
                        className={`px-4 py-1 rounded-lg ${
                          user.isBlocked
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-red-500 hover:bg-red-600'
                        } text-white`}
                      >
                        {user.isBlocked ? 'Mở Chặn' : 'Chặn'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-6 text-gray-600 italic">
              Không có người dùng nào.
            </p>
          )}
        </div>
      </div>
  );
};

export default UserManagement;

