import axios from 'axios';

const API_URL = 'http://localhost:3364/api/event';

// Lấy danh sách sự kiện
export const getEvents = async () => {
    try {
        const response = await axios.get(`${API_URL}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sự kiện:', error);
        throw error;
    }
};

// Tạo sự kiện mới
export const createEvent = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/create`, data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo sự kiện:', error);
        throw error;
    }
};

// Cập nhật sự kiện
export const updateEvent = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật sự kiện:', error);
        throw error;
    }
};

// Xóa sự kiện
export const deleteEvent = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa sự kiện:', error);
        throw error;
    }
};
