import Event from '../models/eventModel.js';
import Service from '../models/service.js';
import Invoice from '../models/invoiceModel.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';

const eventController = {
    // Tạo sự kiện mới
    createEvent: async (req, res) => {
        try {
            const { name, date, category, location, services = [], isPublic } = req.body;
            const userId = req.user.id;

            // Kiểm tra danh mục
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ message: 'ID danh mục không hợp lệ!' });
            }

            const existingCategory = await Category.findById(category);
            if (!existingCategory) {
                return res.status(404).json({ message: 'Danh mục không tồn tại!' });
            }

            // Kiểm tra danh sách dịch vụ nếu không rỗng
            let populatedServices = [];
            if (services.length > 0) {
                populatedServices = await Promise.all(
                    services.map(async (s) => {
                        if (!mongoose.Types.ObjectId.isValid(s.service)) {
                            throw new Error(`ID dịch vụ không hợp lệ: ${s.service}`);
                        }
                        const serviceData = await Service.findById(s.service);
                        if (!serviceData) {
                            throw new Error(`Dịch vụ với ID ${s.service} không tồn tại.`);
                        }
                        return { service: s.service, quantity: s.quantity, price: serviceData.price };
                    })
                );
            }

            // Tạo sự kiện mới
            const newEvent = new Event({
                name,
                date,
                category,
                location,
                services: populatedServices,
                isPublic,
                createdBy: userId,
            });
            const savedEvent = await newEvent.save();

            res.status(201).json({ message: 'Tạo sự kiện thành công!', event: savedEvent });
        } catch (error) {
            console.error('Lỗi khi tạo sự kiện:', error.message);
            res.status(500).json({ message: 'Lỗi khi tạo sự kiện!', error: error.message });
        }
    },

    // Lấy danh sách sự kiện
    getEvents: async (req, res) => {
        try {
            const userId = req.user.id;
            const userRole = req.user.role;

            let events;
            if (userRole === 'admin') {
                // Admin xem tất cả sự kiện
                events = await Event.find()
                    .populate('category', 'name')
                    .populate('services.service', 'name price');
            } else {
                // Người dùng thường chỉ xem công khai hoặc sự kiện họ tạo
                events = await Event.find({
                    $or: [
                        { isPublic: true },
                        { createdBy: userId },
                    ],
                })
                    .populate('category', 'name')
                    .populate('services.service', 'name price');
            }

            res.status(200).json(events);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sự kiện:', error.message);
            res.status(500).json({ message: 'Lỗi khi lấy danh sách sự kiện!' });
        }
    },

    // Lấy sự kiện theo ID
    getEventById: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID sự kiện không hợp lệ!' });
            }

            const event = await Event.findById(id)
                .populate('category', 'name')
                .populate('services.service', 'name price');

            if (!event) {
                return res.status(404).json({ message: 'Không tìm thấy sự kiện!' });
            }

            // Kiểm tra quyền truy cập
            if (!event.isPublic && event.createdBy.toString() !== userId && userRole !== 'admin') {
                return res.status(403).json({ message: 'Bạn không có quyền xem sự kiện này!' });
            }

            res.status(200).json(event);
        } catch (error) {
            console.error('Lỗi khi lấy sự kiện:', error.message);
            res.status(500).json({ message: 'Lỗi khi lấy sự kiện!', error: error.message });
        }
    },

    // Cập nhật sự kiện
    updateEvent: async (req, res) => {
        try {
            const { id } = req.params;
            const { isPublic, name, date, category, location, services = [] } = req.body;
            const userId = req.user.id;
            const userRole = req.user.role;
    
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID sự kiện không hợp lệ!' });
            }
    
            const event = await Event.findById(id);
            if (!event) {
                return res.status(404).json({ message: 'Không tìm thấy sự kiện!' });
            }
    
            // Kiểm tra quyền cập nhật (Admin hoặc người tạo)
            if (event.createdBy.toString() !== userId && userRole !== 'admin') {
                return res.status(403).json({ message: 'Bạn không có quyền cập nhật sự kiện này!' });
            }
    
            // Xử lý cập nhật trạng thái riêng tư/công khai hoặc các thông tin khác
            const updatedData = {};
            if (typeof isPublic !== 'undefined') {
                updatedData.isPublic = isPublic;
            }
            if (name) updatedData.name = name;
            if (date) updatedData.date = date;
            if (category) updatedData.category = category;
            if (location) updatedData.location = location;
    
            const updatedEvent = await Event.findByIdAndUpdate(
                id,
                updatedData,
                { new: true }
            ).populate('category', 'name');
    
            res.status(200).json({ message: 'Cập nhật sự kiện thành công!', event: updatedEvent });
        } catch (error) {
            console.error('Lỗi khi cập nhật sự kiện:', error.message);
            res.status(500).json({ message: 'Lỗi khi cập nhật sự kiện!', error: error.message });
        }
    },
    // Xóa sự kiện
    deleteEvent: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;

            const event = await Event.findById(id);

            if (!event) {
                return res.status(404).json({ message: 'Không tìm thấy sự kiện để xóa!' });
            }

            // Kiểm tra quyền xóa
            if (event.createdBy.toString() !== userId && userRole !== 'admin') {
                return res.status(403).json({ message: 'Bạn không có quyền xóa sự kiện này!' });
            }

            await Event.findByIdAndDelete(id);

            res.status(200).json({ message: 'Xóa sự kiện thành công!' });
        } catch (error) {
            console.error('Lỗi khi xóa sự kiện:', error.message);
            res.status(500).json({ message: 'Lỗi server!' });
        }
    },
    // Thêm dịch vụ vào sự kiện
    addServiceToEvent: async (req, res) => {
        try {
            const { eventId } = req.params;
            const { serviceId, quantity } = req.body;
            const userId = req.user.id;
            const userRole = req.user.role;
    
            const service = await Service.findById(serviceId);
            if (!service) {
                return res.status(404).json({ message: 'Dịch vụ không tồn tại!' });
            }
    
            const event = await Event.findById(eventId);
            if (!event) {
                return res.status(404).json({ message: 'Sự kiện không tồn tại!' });
            }
    
            // Kiểm tra quyền (người tạo hoặc admin)
            if (event.createdBy.toString() !== userId && userRole !== 'admin') {
                return res.status(403).json({ message: 'Bạn không có quyền thêm dịch vụ vào sự kiện này!' });
            }
    
            event.services.push({ service: serviceId, quantity });
            await event.save();
    
            const updatedEvent = await Event.findById(eventId).populate('services.service', 'name price');
            res.status(200).json({ message: 'Thêm dịch vụ thành công!', event: updatedEvent });
        } catch (error) {
            console.error('Lỗi khi thêm dịch vụ:', error.message);
            res.status(500).json({ message: 'Lỗi khi thêm dịch vụ!' });
        }
    },
    

    // Xóa dịch vụ khỏi sự kiện
    removeServiceFromEvent: async (req, res) => {
        try {
            const { eventId, serviceId } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;
    
            const event = await Event.findById(eventId);
            if (!event) {
                return res.status(404).json({ message: 'Sự kiện không tồn tại!' });
            }
    
            // Kiểm tra quyền (người tạo hoặc admin)
            if (event.createdBy.toString() !== userId && userRole !== 'admin') {
                return res.status(403).json({ message: 'Bạn không có quyền xóa dịch vụ khỏi sự kiện này!' });
            }
    
            event.services = event.services.filter(
                (service) => service.service.toString() !== serviceId
            );
            await event.save();
    
            const updatedEvent = await Event.findById(eventId).populate('services.service', 'name price');
            res.status(200).json({ message: 'Xóa dịch vụ thành công!', event: updatedEvent });
        } catch (error) {
            console.error('Lỗi khi xóa dịch vụ:', error.message);
            res.status(500).json({ message: 'Lỗi khi xóa dịch vụ!' });
        }
    },
    
    updateServiceInEvent: async (req, res) => {
        try {
            const { eventId, serviceId } = req.params;
            const { quantity } = req.body;
            const userId = req.user.id;
            const userRole = req.user.role;
    
            const event = await Event.findById(eventId);
            if (!event) {
                return res.status(404).json({ message: 'Sự kiện không tồn tại!' });
            }
    
            // Kiểm tra quyền (người tạo hoặc admin)
            if (event.createdBy.toString() !== userId && userRole !== 'admin') {
                return res.status(403).json({ message: 'Bạn không có quyền cập nhật dịch vụ trong sự kiện này!' });
            }
    
            const serviceIndex = event.services.findIndex(
                (service) => service.service.toString() === serviceId
            );
    
            if (serviceIndex === -1) {
                return res.status(404).json({ message: 'Dịch vụ không tồn tại trong sự kiện!' });
            }
    
            event.services[serviceIndex].quantity = quantity;
    
            await event.save();
    
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
    
    // Lấy hoặc tạo hóa đơn
    getInvoiceByEventId: async (req, res) => {
        try {
            const { eventId } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;
    
            const event = await Event.findById(eventId).populate('services.service');
    
            if (!event) {
                return res.status(404).json({ message: 'Không tìm thấy sự kiện!' });
            }
    
            // Kiểm tra quyền truy cập
            if (!event.isPublic && event.createdBy.toString() !== userId && userRole !== 'admin') {
                return res.status(403).json({ message: 'Bạn không có quyền truy cập hóa đơn của sự kiện này!' });
            }
    
            let invoice = await Invoice.findOne({ event: eventId });
    
            if (!invoice) {
                const totalAmount = event.services.reduce(
                    (sum, s) => sum + s.quantity * s.service.price,
                    0
                );
    
                invoice = new Invoice({
                    event: eventId,
                    services: event.services.map((s) => ({
                        service: s.service._id,
                        quantity: s.quantity,
                        price: s.service.price,
                    })),
                    totalAmount,
                });
    
                await invoice.save();
            }
    
            const populatedInvoice = await Invoice.findById(invoice._id)
                .populate('event', 'name date category location')
                .populate('services.service', 'name price');
    
            res.status(200).json(populatedInvoice);
        } catch (error) {
            console.error('Lỗi khi lấy hóa đơn:', error.message);
            res.status(500).json({ message: 'Lỗi khi lấy hóa đơn!' });
        }
    }
    
};

export default eventController;
