import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userController = {
    registerUser: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email đã được sử dụng' });
            }

            const newUser = new User({
                username,
                email,
                password, // pre('save') sẽ mã hóa mật khẩu
                role: 'user'
            });

            await newUser.save();
            res.status(201).json({ message: 'Đăng ký thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
            }

            const token = jwt.sign(
                { id: user._id, username: user.username, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.status(200).json({
                message: 'Đăng nhập thành công',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    // Lấy danh sách tất cả người dùng
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    // Sửa thông tin người dùng
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedData = req.body;

            const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng' });
            }

            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    // Xóa người dùng
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng' });
            }

            res.status(200).json({ message: 'Xóa người dùng thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    // Chặn hoặc mở chặn tài khoản người dùng
    toggleUserBlock: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng' });
            }

            user.isBlocked = !user.isBlocked;
            await user.save();

            res.status(200).json({ message: user.isBlocked ? 'Tài khoản bị chặn' : 'Tài khoản đã được mở chặn' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    }
};

export default userController;
