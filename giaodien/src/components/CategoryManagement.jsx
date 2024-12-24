import React, { useState, useEffect } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService';
import AdminLayout from './AdminLayout';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '' });
  const [editingCategoryId, setEditingCategoryId] = useState(null); // ID của Category đang được chỉnh sửa
  const [loading, setLoading] = useState(false);

  // Lấy danh sách Category
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách Category:', error);
    }
    setLoading(false);
  };

  // Xử lý khi gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategoryId) {
        // Cập nhật Category
        await updateCategory(editingCategoryId, formData);
        alert('Cập nhật Category thành công!');
      } else {
        // Tạo mới Category
        await createCategory(formData);
        alert('Thêm mới Category thành công!');
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Lỗi khi thêm/cập nhật Category:', error);
      alert('Không thể thêm/cập nhật Category!');
    }
  };

  // Chỉnh sửa Category
  const handleEdit = (category) => {
    setFormData({ name: category.name });
    setEditingCategoryId(category._id);
  };

  // Xóa Category
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa Category này không?')) {
      try {
        await deleteCategory(id);
        alert('Xóa Category thành công!');
        fetchCategories();
      } catch (error) {
        console.error('Lỗi khi xóa Category:', error);
        alert('Không thể xóa Category!');
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '' });
    setEditingCategoryId(null);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-purple-600">
          {editingCategoryId ? 'Cập nhật Category' : 'Thêm mới Category'}
        </h2>

        {/* Form thêm/cập nhật Category */}
        <form
          onSubmit={handleSubmit}
          className="mb-10 bg-white shadow-md rounded p-6"
        >
          <input
            type="text"
            placeholder="Tên Category"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border border-gray-300 p-3 mb-4 w-full rounded"
            required
          />
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-600 transition-all"
            >
              {editingCategoryId ? 'Cập nhật' : 'Thêm mới'}
            </button>
            {editingCategoryId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-gray-600 transition-all"
              >
                Hủy
              </button>
            )}
          </div>
        </form>

        {/* Danh sách Category */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">
            Danh sách Category
          </h3>
          {loading ? (
            <p>Đang tải...</p>
          ) : categories.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {categories.map((category) => (
                <li
                  key={category._id}
                  className="flex justify-between items-center py-4 hover:bg-gray-50 transition-all duration-200 rounded-lg px-4"
                >
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">
                      {category.name}
                    </h4>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEdit(category)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-yellow-600 transition-all"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-600 transition-all"
                    >
                      Xóa
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center">Không có Category nào.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoryManagement;
