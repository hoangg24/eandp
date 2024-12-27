import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentResult = () => {
  const query = new URLSearchParams(useLocation().search);
  const resultCode = query.get('resultCode'); // Lấy mã kết quả từ URL
  const message = query.get('message'); // Lấy thông điệp từ URL

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4">
          {resultCode === '0' ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
        </h1>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default PaymentResult;
