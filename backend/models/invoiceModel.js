import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
    event: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event', 
        required: true 
    }, // Tham chiếu đến sự kiện
    services: [
        {
            service: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Service',
                required: true 
            }, // Tham chiếu đến dịch vụ
            quantity: { 
                type: Number, 
                required: true 
            }, // Số lượng dịch vụ
            price: { 
                type: Number, 
                required: true 
            } // Giá dịch vụ tại thời điểm hóa đơn
        }
    ],
    totalAmount: { 
        type: Number, 
        required: true 
    }, // Tổng tiền hóa đơn
    createdAt: { 
        type: Date, 
        default: Date.now 
    } // Ngày tạo hóa đơn
});

export default mongoose.model('Invoice', InvoiceSchema);
