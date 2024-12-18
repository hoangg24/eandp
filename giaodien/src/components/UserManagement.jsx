import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' });
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3364/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (mode, user = null) => {
    setModalMode(mode);
    if (mode === 'edit' && user) {
      setEditingUser(user);
      setNewUser({ username: user.username, email: user.email, role: user.role });
    } else {
      setNewUser({ username: '', email: '', password: '', role: 'user' });
      setEditingUser(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewUser({ username: '', email: '', password: '', role: 'user' });
    setEditingUser(null);
  };

  const handleAddUser = async () => {
    try {
      await axios.post('http://localhost:3364/api/users/register', newUser);
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditUser = async () => {
    try {
      await axios.put(`http://localhost:3364/api/users/${editingUser._id}`, newUser);
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      try {
        await axios.delete(`http://localhost:3364/api/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await axios.put(`http://localhost:3364/api/users/block/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Quản lý người dùng
        </h1>
        <p className="text-lg text-gray-600">Thêm, chỉnh sửa, và quản lý người dùng trong hệ thống</p>
      </div>

      <div className="text-right mb-4">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
          onClick={() => openModal('add')}
        >
          Thêm người dùng
        </button>
      </div>

      <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b font-semibold">Tên người dùng</th>
              <th className="py-2 px-4 border-b font-semibold">Email</th>
              <th className="py-2 px-4 border-b font-semibold">Vai trò</th>
              <th className="py-2 px-4 border-b font-semibold">Trạng thái</th>
              <th className="py-2 px-4 border-b font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={`px-2 py-1 rounded ${
                      user.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {user.isBlocked ? 'Bị chặn' : 'Hoạt động'}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-yellow-500 text-white px-4 py-1 rounded-lg mr-2 hover:bg-yellow-600 transition-all"
                    onClick={() => openModal('edit', user)}
                  >
                    Sửa
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded-lg mr-2 hover:bg-red-600 transition-all"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Xóa
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-1 rounded-lg hover:bg-gray-600 transition-all"
                    onClick={() => handleBlockUser(user._id)}
                  >
                    {user.isBlocked ? 'Mở chặn' : 'Chặn'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">
          {modalMode === 'add' ? 'Thêm người dùng' : 'Sửa thông tin người dùng'}
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block font-medium">Tên người dùng</label>
            <input
              type="text"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {modalMode === 'add' && (
            <div>
              <label className="block font-medium">Mật khẩu</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}
          <div>
            <label className="block font-medium">Vai trò</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </form>
        <div className="mt-6 flex justify-end">
          <button
            onClick={modalMode === 'add' ? handleAddUser : handleEditUser}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            {modalMode === 'add' ? 'Thêm' : 'Lưu'}
          </button>
          <button
            onClick={closeModal}
            className="ml-4 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
          >
            Đóng
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
