import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../store/UserContext.jsx';

const Header = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-indigo-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center h-16">
          {/* Logo & Navigation Links */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <svg
                className="h-8 w-8 text-indigo-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <span className="text-xl font-bold text-white">EANDP</span>
            </Link>

            {/* Navigation Links */}
            {user && (
              <>
                <Link
                  to="/events/create"
                  className="text-indigo-100 hover:text-white transition-colors duration-150 ease-in-out text-sm font-medium"
                >
                  Create Event
                </Link>
                <Link
                  to="/eventlist"
                  className="text-indigo-100 hover:text-white transition-colors duration-150 ease-in-out text-sm font-medium"
                >
                  Danh Sách Sự Kiện
                </Link>
                <Link
                  to="/invoices"
                  className="text-indigo-100 hover:text-white transition-colors duration-150 ease-in-out text-sm font-medium"
                >
                  Danh Sách hóa đơn
                </Link>
              </>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-400 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-indigo-100">
                    {user.username}
                  </span>
                </div>
                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 ease-in-out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-indigo-100 hover:text-white transition-colors duration-150 ease-in-out text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 ease-in-out"
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
