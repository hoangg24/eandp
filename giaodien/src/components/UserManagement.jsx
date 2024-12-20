import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout'; // Import AdminLayout

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold text-purple-600 mb-6 text-center">
          Quản Lý Người Dùng
        </h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="w-full table-auto border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-purple-100 text-left">
                <th className="py-2 px-4 border-b">Tên Người Dùng</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Vai Trò</th>
                <th className="py-2 px-4 border-b">Trạng Thái</th>
                <th className="py-2 px-4 border-b">Hành Động</th>
              </tr>
            </thead>
            {/* Table Body */}
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
                    <button className="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600">
                      Sửa
                    </button>
                    <button className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
