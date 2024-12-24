import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true }, // Tên sự kiện
    date: { type: Date, required: true }, // Ngày tổ chức sự kiện
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Loại sự kiện tham chiếu đến Category
    location: { type: String, required: true, trim: true }, // Địa điểm tổ chức sự kiện
   services: {
    type: [{ 
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        quantity: { type: Number, default: 0, min: 0 }
    }],
    default: []
},
    createdAt: { type: Date, default: Date.now }, // Ngày tạo
    vote: { type: Number, default: 0, min: 0 }, // Số lượt đánh giá (mặc định là 0)
});

export default mongoose.model('Event', eventSchema);
