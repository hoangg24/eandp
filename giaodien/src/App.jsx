import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserManagement from "./components/UserManagement.jsx";
import Unauthorized from "./pages/Unauthorized.jsx"; // Import trang Unauthorized
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // Import ProtectedRoute
import EventManagement from './components/EventManagement.jsx'; 
import ServiceManagement from './components/ServiceManagement.jsx'; 
import ServiceDetailManagement from './components/ServiceDetailManagement.jsx'; 

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="/events" element={<EventManagement />} /> 
        <Route path="/events/:eventId/services" element={<ServiceManagement />} /> 
        <Route path="/events/:eventId/:serviceName/details" element={<ServiceDetailManagement />} /> 
      </Route>

      {/* Route cho admin, chỉ cho phép admin truy cập */}
      <Route path="admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      }>
        <Route path="users" element={<UserManagement />} />
      </Route>

      {/* Route cho trang Unauthorized */}
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
};

export default App;
