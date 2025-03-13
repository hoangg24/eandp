import React from "react";
import { Link, Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  Package,
  LayoutGrid,
  FileText,
  ChevronLeft,
  Home,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../store/UserContext";

const AdminLayout = () => {
  const { user, logout } = useContext(UserContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate(); // Hook for programmatic navigation

  const menuItems = [
    { name: "User Management", path: "/admin/users", icon: Users },
    { name: "Event Management", path: "/admin/events", icon: Calendar },
    { name: "Service Management", path: "/admin/services", icon: Package },
    {
      name: "Category Management",
      path: "/admin/categories",
      icon: LayoutGrid,
    },
    { name: "Invoice Management", path: "/admin/invoices", icon: FileText },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-72" : "w-20"
        } bg-gradient-to-br from-indigo-800 via-purple-800 to-purple-900 
        text-white shadow-2xl transition-all duration-300 ease-in-out 
        fixed h-screen z-20 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center border-b border-indigo-700/30">
          <div
            className={`flex items-center justify-between w-full transition-all duration-300 ${
              isSidebarOpen ? "space-x-3" : "space-x-0"
            }`}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-900 text-xl font-bold">A</span>
              </div>
              <h2
                className={`text-xl font-semibold tracking-wide ml-3 transition-all duration-300 ${
                  isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
                }`}
              >
                Admin Dashboard
              </h2>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-indigo-700/50 transition-all duration-200 flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              <ChevronLeft
                className={`h-5 w-5 transform transition-transform duration-300 ${
                  isSidebarOpen ? "rotate-0" : "rotate-180"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-xl transition-all duration-200 
                    group relative overflow-hidden ${
                      isActive
                        ? "bg-white text-indigo-900 shadow-md"
                        : "text-white hover:bg-indigo-700/50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className="h-5 w-5 min-w-[20px] z-10" />
                      <span
                        className={`ml-3 font-medium transition-all duration-200 ${
                          isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
                        }`}
                      >
                        {item.name}
                      </span>
                      {/* Hover effect */}
                      <span
                        className={`absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent 
                        transform ${isActive ? "scale-100" : "scale-0"} 
                        transition-transform duration-200 group-hover:scale-100`}
                      />
                      {/* Tooltip for collapsed state */}
                      {!isSidebarOpen && (
                        <span
                          className="absolute left-full ml-2 p-2 bg-gray-900 
                          text-white text-sm rounded-md opacity-0 group-hover:opacity-100 
                          transition-opacity duration-200 whitespace-nowrap"
                        >
                          {item.name}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        {isSidebarOpen && (
          <div className="p-4 mt-auto border-t border-indigo-700/30">
            <p className="text-sm text-indigo-200">
              © {new Date().getFullYear()} Admin Panel
            </p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-72" : "ml-20"
        } p-6 md:p-8`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-6 flex items-center justify-between">
            <h1
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r 
              from-indigo-600 to-purple-600 bg-clip-text text-transparent 
              animate-fade-in"
            >
              Admin Control Panel
            </h1>
            <div className="flex space-x-3">
              {/* Home Button */}
              <Link to="/">
                <button
                  className="px-4 py-2 text-sm font-medium text-indigo-600 
                  bg-indigo-100 rounded-lg hover:bg-indigo-200 hover:shadow-md 
                  transition-all duration-200 flex items-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </button>
              </Link>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white 
                  bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg 
                  hover:from-indigo-700 hover:to-purple-700 hover:shadow-md 
                  transition-all duration-200 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </header>

          {/* Content Area */}
          <div
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 
            backdrop-blur-sm bg-opacity-95 animate-slide-up"
          >
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
