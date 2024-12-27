import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PaymentStatus = () => {
  const { orderId } = useParams(); // Lấy orderId từ URL
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaymentStatus();
  }, [orderId]);

  const fetchPaymentStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/payments/status/${orderId}`);
      setPaymentStatus(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải trạng thái thanh toán');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Đang tải trạng thái thanh toán...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        Lỗi: {error}
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Trạng Thái Thanh Toán</h1>
        <p>
          <strong>Order ID:</strong> {paymentStatus.transactionId}
        </p>
        <p>
          <strong>Số Tiền:</strong> {paymentStatus.amount.toLocaleString()} VND
        </p>
        <p>
          <strong>Trạng Thái:</strong>{' '}
          <span
            className={`font-semibold ${
              paymentStatus.status === 'Completed'
                ? 'text-green-500'
                : 'text-red-500'
            }`}
          >
            {paymentStatus.status === 'Completed'
              ? 'Thành Công'
              : 'Thất Bại'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default PaymentStatus;
