import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true }, // Tên sự kiện
    date: { type: Date, required: true }, // Ngày tổ chức sự kiện
    category: { type: String, required: true, trim: true }, // Loại sự kiện
    location: { type: String, required: true, trim: true }, // Địa điểm tổ chức sự kiện
    services: [
        {
            service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }, // Tham chiếu tới model Service
            quantity: { type: Number, required: true, min: 1 }, // Số lượng dịch vụ
        },
    ],
    createdAt: { type: Date, default: Date.now }, // Ngày tạo
    vote: { type: Number, default: 0, min: 0 }, // Số lượt đánh giá (mặc định là 0)
});

export default mongoose.model('Event', eventSchema);
