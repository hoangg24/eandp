import Event from '../models/eventModel.js';
import Service from '../models/service.js';
import Invoice from '../models/invoiceModel.js';

// Thêm sự kiện mới
const eventController ={
    createEvent: async (req, res) => {
        try {
            const { name, date, category, location, services } = req.body;
    
            // Kiểm tra và lấy thông tin dịch vụ từ DB
            const populatedServices = await Promise.all(
                services.map(async (s) => {
                    const serviceData = await Service.findById(s.service);
                    if (!serviceData) {
                        throw new Error(`Dịch vụ với ID ${s.service} không tồn tại.`);
                    }
                    return {
                        service: s.service,
                        quantity: s.quantity,
                        price: serviceData.price, // Lấy giá từ DB
                    };
                })
            );
    
            console.log("Dịch vụ populate:", populatedServices); // Log kết quả populate
    
            // Tạo sự kiện mới
            const newEvent = new Event({
                name,
                date,
                category,
                location,
                services: populatedServices.map((s) => ({
                    service: s.service,
                    quantity: s.quantity,
                })),
            });
            const savedEvent = await newEvent.save();
    
            // Tính tổng tiền hóa đơn
            const totalAmount = populatedServices.reduce(
                (sum, s) => sum + s.quantity * s.price,
                0
            );
    
            // Tạo hóa đơn mới
            const newInvoice = new Invoice({
                event: savedEvent._id,
                services: populatedServices,
                totalAmount,
            });
            await newInvoice.save();
    
            res.status(201).json({
                message: 'Sự kiện và hóa đơn đã được tạo thành công!',
                event: savedEvent,
                invoice: newInvoice,
            });
        } catch (error) {
            console.error('Lỗi khi tạo sự kiện và hóa đơn:', error.message);
            res.status(500).json({ message: 'Lỗi khi tạo sự kiện và hóa đơn!', error: error.message });
        }
    },
    
    
     getEvents : async (req, res) => {
    try {
        const events = await Event.find(); // Lấy toàn bộ sự kiện
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sự kiện!' });
    }
},

     getEventById : async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id).populate('services.service', 'name price'); // Lấy sự kiện theo ID
        if (!event) {
            return res.status(404).json({ message: 'Không tìm thấy sự kiện!' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy sự kiện!' });
    }
},
     updateEvent : async (req, res) => {
    try {
        const { id } = req.params;
        const { name, date, category, location, services } = req.body;

        // Validate dữ liệu
        if (!name || !date || !location || !category || !services || !Array.isArray(services)) {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ!' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { name, date,category, location, services },
            { new: true } // Trả về sự kiện đã cập nhật
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Không tìm thấy sự kiện để cập nhật!' });
        }

        res.status(200).json({ message: 'Cập nhật sự kiện thành công!', event: updatedEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật sự kiện!' });
    }
},
     deleteEvent : async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ message: 'Không tìm thấy sự kiện để xóa!' });
        }

        res.status(200).json({ message: 'Xóa sự kiện thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa sự kiện!' });
    }
},
     addServiceToEvent : async (req, res) => {
    try {
        const { eventId } = req.params; // Lấy ID sự kiện
        const { serviceId, quantity } = req.body; // Lấy serviceId và quantity từ body

        // Kiểm tra dịch vụ có tồn tại không
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Dịch vụ không tồn tại!' });
        }

        // Tìm sự kiện
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Sự kiện không tồn tại!' });
        }

        // Thêm dịch vụ vào mảng services với quantity
        event.services.push({ service: serviceId, quantity });
        await event.save();

        // Populate để lấy thông tin chi tiết dịch vụ và trả về
        const updatedEvent = await Event.findById(eventId).populate('services.service', 'name description price');

        return res.status(200).json({
            message: 'Dịch vụ đã được thêm vào sự kiện',
            event: updatedEvent,
        });
    } catch (error) {
        console.error('Lỗi server:', error.message);
        return res.status(500).json({ message: 'Lỗi server!', error: error.message });
    }
},

     removeServiceFromEvent : async (req, res) => {
    try {
        const { eventId, serviceId } = req.params;

        // Tìm sự kiện
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Sự kiện không tồn tại!' });
        }

        // Xóa dịch vụ khỏi mảng services
        event.services = event.services.filter(
            (service) => service.service.toString() !== serviceId
        );

        await event.save();

        // Populate để gửi lại thông tin chi tiết sự kiện
        const updatedEvent = await Event.findById(eventId).populate('services.service', 'name description price');

        return res.status(200).json({
            message: 'Dịch vụ đã được xóa khỏi sự kiện',
            event: updatedEvent,
        });
    } catch (error) {
        console.error('Lỗi server:', error.message);
        return res.status(500).json({ message: 'Lỗi server!', error: error.message });
    }
},
     updateServiceInEvent : async (req, res) => {
    try {
        const { eventId, serviceId } = req.params;
        const { quantity } = req.body; // Số lượng mới

        // Tìm sự kiện
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Sự kiện không tồn tại!' });
        }

        // Cập nhật số lượng dịch vụ
        const serviceIndex = event.services.findIndex(
            (service) => service.service.toString() === serviceId
        );

        if (serviceIndex === -1) {
            return res.status(404).json({ message: 'Dịch vụ không tồn tại trong sự kiện!' });
        }

        event.services[serviceIndex].quantity = quantity;

        await event.save();

        // Populate để gửi lại thông tin chi tiết sự kiện
        const updatedEvent = await Event.findById(eventId).populate('services.service', 'name description price');

        return res.status(200).json({
            message: 'Dịch vụ trong sự kiện đã được cập nhật',
            event: updatedEvent,
        });
    } catch (error) {
        console.error('Lỗi server:', error.message);
        return res.status(500).json({ message: 'Lỗi server!', error: error.message });
    }
},
getInvoiceByEventId: async (req, res) => {
    try {
        const { eventId } = req.params;

        // Kiểm tra xem hóa đơn đã tồn tại chưa
        let invoice = await Invoice.findOne({ event: eventId });

        if (!invoice) {
            // Lấy thông tin sự kiện
            const event = await Event.findById(eventId).populate('services.service');
            if (!event) {
                return res.status(404).json({ message: 'Không tìm thấy sự kiện!' });
            }

            // Tính tổng tiền
            const totalAmount = event.services.reduce(
                (sum, s) => sum + s.quantity * s.service.price,
                0
            );

            // Tạo hóa đơn mới
            invoice = new Invoice({
                event: eventId,
                services: event.services.map((s) => ({
                    service: s.service._id,
                    quantity: s.quantity,
                    price: s.service.price,
                })),
                totalAmount,
            });

            await invoice.save(); // Lưu hóa đơn vào DB
        }

        // Populate dữ liệu hóa đơn để trả về
        const populatedInvoice = await Invoice.findById(invoice._id)
            .populate('event', 'name date category location')
            .populate('services.service', 'name price');

        res.status(200).json(populatedInvoice);
    } catch (error) {
        console.error('Lỗi khi lấy hoặc tạo hóa đơn:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy hoặc tạo hóa đơn!' });
    }
}
}
export default eventController;






