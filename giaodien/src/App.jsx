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
import Invoice from './components/Invoice.jsx';
import EventList from './components/EventList.jsx';
import EventDetails from './components/EventDetails.jsx';
import InvoiceManagement from './components/InvoiceManagement.jsx';
import InvoiceDetails from './components/InvoiceDetails.jsx';
import CreateEvent from './components/CreateEvent.jsx';
const App = () => {
  return (
    <Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="register" element={<Register />} />
    <Route path="login" element={<Login />} />
    <Route path="events" element={<EventManagement />} />
    <Route path="services" element={<ServiceManagement />} />
    <Route path="events/:eventId/invoices" element={<Invoice />} />
    <Route path="eventlist" element={<EventList />} />
    <Route path="events/:eventId" element={<EventDetails />} />
    <Route path="invoices" element={<InvoiceManagement />} />
    <Route path="invoices/:id" element={<InvoiceDetails />} />
    <Route path="events/create" element={<CreateEvent />} />
  </Route>

  <Route path="admin" element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }>
    <Route path="users" element={<UserManagement />} />
  </Route>

  <Route path="unauthorized" element={<Unauthorized />} />
</Routes>

  );
};

export default App;
