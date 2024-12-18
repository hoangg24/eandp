// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Để mã hóa mật khẩu

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: { // Email dùng để đăng nhập
        type: String,
        required: true,
        unique: true // Đảm bảo email là duy nhất
    },
    password: { // Mật khẩu được mã hóa
        type: String,
        required: true
    },

    role: { // Phân biệt học sinh và giáo viên
        type: String,
        enum: ['user', 'admin'],
        default: 'user' // Mặc định là học sinh
    },
    createdAt: { // Thời gian tạo tài khoản
        type: Date,
        default: Date.now
    },
    isBlocked: { // Trạng thái tài khoản
        type: Boolean,
        default: false
    },
    
});

// Hàm mã hóa mật khẩu trước khi lưu user
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next(); // Nếu mật khẩu chưa thay đổi, bỏ qua
    }
    const salt = await bcrypt.genSalt(10); // Tạo salt với độ dài 10
    user.password = await bcrypt.hash(user.password, salt); // Mã hóa mật khẩu
    next();
});

// So sánh mật khẩu người dùng nhập với mật khẩu đã lưu
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);

