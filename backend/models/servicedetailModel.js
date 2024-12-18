import mongoose from 'mongoose';

const serviceDetailSchema = new mongoose.Schema({
    serviceName: { type: String, required: true }, // Tên dịch vụ (VD: "Bàn ăn")
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }, // Liên kết tới sự kiện
    details: [
        {
            name: { type: String, required: true }, // Tên chi tiết (VD: "Gà quay", "Trưởng nhóm nhạc")
            description: { type: String }, // Mô tả chi tiết
        }
    ],
});

export default mongoose.model('ServiceDetail', serviceDetailSchema);
