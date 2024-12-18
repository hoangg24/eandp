import axios from 'axios';

const API_URL = 'http://localhost:3364/api/event';

// Lấy danh sách dịch vụ của một sự kiện
export const getServices = async (eventId) => {
    try {
        const response = await axios.get(`${API_URL}/${eventId}`);
        return response.data.services;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách dịch vụ:', error);
        throw error;
    }
};

// Thêm dịch vụ vào sự kiện
export const addService = async (eventId, data) => {
    try {
        const response = await axios.post(`${API_URL}/${eventId}/add-service`, data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi thêm dịch vụ:', error);
        throw error;
    }
};

// Xóa dịch vụ khỏi sự kiện
export const deleteService = async (eventId, serviceName) => {
    try {
        const response = await axios.delete(`${API_URL}/${eventId}/remove-service/${serviceName}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa dịch vụ:', error);
        throw error;
    }
};

// Cập nhật thông tin dịch vụ
export const updateService = async (eventId, serviceName, data) => {
    try {
        const response = await axios.put(`${API_URL}/${eventId}/update-service/${serviceName}`, data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật dịch vụ:', error);
        throw error;
    }
};
