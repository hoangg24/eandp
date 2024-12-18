import express from 'express';
import userController from '../controllers/userController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
// Lấy danh sách người dùng
router.get('/', userController.getAllUsers);

// Cập nhật thông tin người dùng
router.put('/:id', userController.updateUser);

// Xóa người dùng
router.delete('/:id', userController.deleteUser);

// Chặn hoặc mở chặn tài khoản người dùng
router.put('/block/:id', userController.toggleUserBlock);

export default router;