import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="min-h-screen grid grid-cols-5">
      {/* Sidebar */}
      <aside className="col-span-1 bg-gradient-to-b from-purple-600 to-indigo-600 p-6 text-white">
        <h2 className="text-lg font-bold mb-6">Admin Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <Link to="/admin/users" className="hover:text-indigo-200">
              Quản lý người dùng
            </Link>
          </li>
          <li>
            <Link to="/admin/events" className="hover:text-indigo-200">
              Quản lý sự kiện
            </Link>
          </li>
          <li>
            <Link to="/admin/services" className="hover:text-indigo-200">
              Quản lý dịch vụ
            </Link>
          </li>
          <li>
            <Link to="/admin/categories" className="hover:text-indigo-200">
              Quản lý danh mục
            </Link>
          </li>
          <li>
            <Link to="/admin/invoices" className="hover:text-indigo-200">
              Quản lý hóa đơn
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="col-span-4 bg-gray-100 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

