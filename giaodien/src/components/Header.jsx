import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../store/UserContext.jsx";

const Header = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-indigo-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center h-16">
          {/* Logo & Navigation Links */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <svg
                className="h-9 w-9 text-indigo-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                EANDP
              </span>
            </Link>

            {/* Navigation Links */}
            {user && (
              <div className="flex items-center space-x-6">
                <Link
                  to="/events/create"
                  className="text-indigo-100 hover:text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                >
                  Create Event
                </Link>
                <Link
                  to="/eventlist"
                  className="text-indigo-100 hover:text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                >
                  Event List
                </Link>
                <Link
                  to="/invoices"
                  className="text-indigo-100 hover:text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                >
                  Invoice List
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin/users"
                    className="text-indigo-100 hover:text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  >
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-full bg-indigo-400 flex items-center justify-center shadow-md">
                    <span className="text-base font-semibold text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-indigo-100 hidden sm:block">
                    {user.username}
                  </span>
                </div>
                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-full font-semibold shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-indigo-800 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-indigo-100 hover:text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-indigo-600 rounded-full font-semibold shadow-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-indigo-800 transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
