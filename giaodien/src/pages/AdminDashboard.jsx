import { Link, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const menuItems = [
    { name: "Quản lý người dùng", route: "/users" },
    { name: "Quản lý sự kiện", route: "/events" },
    { name: "Quản lý dịch vụ", route: "/services" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-purple-600 to-purple-800 text-white h-screen p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <ul>
          {menuItems.map((item) => (
            <li key={item.route} className="mb-4">
              <Link
                to={item.route}
                className="block p-3 bg-purple-700 hover:bg-purple-600 rounded-lg transition-all text-white font-medium"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-purple-800">Chào mừng đến Dashboard</h1>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;

