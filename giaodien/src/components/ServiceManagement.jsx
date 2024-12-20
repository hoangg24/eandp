import React, { useState, useEffect } from 'react';
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
} from '../services/serviceService';
import AdminLayout from '../components/AdminLayout'; // Import AdminLayout

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
  });
  const [editingServiceId, setEditingServiceId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách dịch vụ:', error);
      alert('Không thể tải danh sách dịch vụ!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingServiceId) {
        await updateService(editingServiceId, serviceForm);
        alert('Cập nhật dịch vụ thành công!');
      } else {
        await createService(serviceForm);
        alert('Thêm dịch vụ thành công!');
      }
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Lỗi khi thêm/cập nhật dịch vụ:', error);
      alert('Không thể thêm/cập nhật dịch vụ!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này không?')) {
      try {
        await deleteService(id);
        alert('Xóa dịch vụ thành công!');
        fetchServices();
      } catch (error) {
        console.error('Lỗi khi xóa dịch vụ:', error);
        alert('Không thể xóa dịch vụ!');
      }
    }
  };

  const handleEdit = (service) => {
    setServiceForm({
      name: service.name,
      description: service.description,
      quantity: service.quantity,
      price: service.price,
    });
    setEditingServiceId(service._id);
  };

  const resetForm = () => {
    setServiceForm({ name: '', description: '', quantity: 0, price: 0 });
    setEditingServiceId(null);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-8">
          Quản Lý Dịch Vụ
        </h2>

        {/* Form thêm/cập nhật dịch vụ */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg mb-10"
        >
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">
            {editingServiceId ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tên dịch vụ"
              value={serviceForm.name}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, name: e.target.value })
              }
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <textarea
              placeholder="Mô tả dịch vụ"
              value={serviceForm.description}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, description: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <input
              type="number"
              placeholder="Số lượng"
              value={serviceForm.quantity}
              onChange={(e) =>
                setServiceForm({
                  ...serviceForm,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
              required
              min="0"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Giá dịch vụ"
                value={serviceForm.price}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setServiceForm({
                    ...serviceForm,
                    price: parseFloat(value) || 0,
                  });
                }}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <span className="ml-2">VNĐ</span>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all"
            >
              {editingServiceId ? 'Cập nhật' : 'Thêm'}
            </button>
            {editingServiceId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all"
              >
                Hủy
              </button>
            )}
          </div>
        </form>

        {/* Danh sách dịch vụ */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">
            Danh sách dịch vụ
          </h3>
          <ul className="space-y-4">
            {services.map((service) => (
              <li
                key={service._id}
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <h4 className="text-lg font-bold">{service.name}</h4>
                  <p className="text-gray-600">{service.description}</p>
                  <p className="text-gray-700">
                    Số lượng: {service.quantity} - Giá:{' '}
                    {service.price.toLocaleString()} VND
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(service)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ServiceManagement;
