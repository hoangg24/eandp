import { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

// Tạo context
export const UserContext = createContext();

// Provider để quản lý trạng thái người dùng
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái loading để kiểm tra việc load user

  useEffect(() => {
    // Kiểm tra và load user từ localStorage (nếu có token)
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // Cập nhật user từ token đã giải mã
      } catch (error) {
        console.error('Error decoding token:', error);
        setUser(null);
      }
    } else {
      setUser(null); // Nếu không có token, set user thành null
    }
    setLoading(false); // Hoàn tất việc kiểm tra token
  }, []);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token); // Decode token để lấy thông tin người dùng
      setUser(decoded); // Lưu thông tin user vào state
      localStorage.setItem('token', token); // Lưu token vào localStorage
    } catch (error) {
      console.error('Error decoding token on login:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token'); // Xóa token khi logout
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
