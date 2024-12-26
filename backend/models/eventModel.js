import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    location: { type: String, required: true, trim: true },
    services: {
        type: [
            {
                service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
                quantity: { type: Number, default: 0, min: 0 },
            },
        ],
        default: [],
    },
    createdAt: { type: Date, default: Date.now },
    vote: { type: Number, default: 0, min: 0 },
    isPublic: { type: Boolean, default: false }, // Thêm trạng thái công khai/riêng tư
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người tạo sự kiện
});

export default mongoose.model('Event', eventSchema);

