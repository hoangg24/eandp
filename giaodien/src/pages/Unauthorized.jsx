import React from 'react';
import { useNavigate } from 'react-router-dom';
import unauthorizedImage from '../assets/unauthorized.jpg'; // Thêm ảnh minh họa (cần có ảnh này)

const Unauthorized = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center text-center">
                <img src={unauthorizedImage} alt="Unauthorized access" className="w-64 mb-6" />
                <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Không có quyền truy cập</h1>
                <p className="text-lg text-gray-700 mb-6">
                    Xin lỗi, bạn không có quyền truy cập vào trang này.
                </p>
                <button
                    onClick={handleGoHome}
                    className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
                >
                    Trở về trang chủ
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;
