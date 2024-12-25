import express from 'express';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

// Route khởi tạo thanh toán
router.post('/create', paymentController.createPayment);

// Route xử lý callback từ ZaloPay
router.post('/callback', paymentController.vnpayReturn);

export default router;
