import Event from '../models/eventModel.js';
import Service from '../models/service.js';
import Invoice from '../models/invoiceModel.js';
import Category from '../models/Category.js';

const eventController = {
    // Tạo sự kiện mới
    createEvent: async (req, res) => {
        try {
            const { name, date, category, location, services } = req.body;

            // Kiểm tra danh mục
            const existingCategory = await Category.findById(category);
            if (!existingCategory) {
                return res.status(404).json({ message: 'Danh mục không tồn tại!' });
            }
            

            // Lấy thông tin dịch vụ từ DB
            const populatedServices = await Promise.all(
                services.map(async (s) => {
                    const serviceData = await Service.findById(s.service);
                    if (!serviceData) {
                        throw new Error(`Dịch vụ với ID ${s.service} không tồn tại.`);
                    }
                    return {
                        service: s.service,
                        quantity: s.quantity,
                        price: serviceData.price,
                    };
                })
            );

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

            // Tạo hóa đơn
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
            console.error('Lỗi khi tạo sự kiện:', error.message);
            res.status(500).json({ message: 'Lỗi khi tạo sự kiện!', error: error.message });
        }
    },

    // Lấy danh sách sự kiện
    getEvents: async (req, res) => {
        try {
            const events = await Event.find()
                .populate('category', 'name') // Lấy tên danh mục
                .populate('services.service', 'name price'); // Lấy thông tin dịch vụ
            res.status(200).json(events);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sự kiện:', error.message);
            res.status(500).json({ message: 'Lỗi khi lấy danh sách sự kiện!' });
        }
    },

    // Lấy thông tin sự kiện theo ID
    getEventById: async (req, res) => {
        try {
            const { id } = req.params;
            const event = await Event.findById(id)
                .populate('category', 'name') // Lấy thông tin danh mục
                .populate('services.service', 'name price'); // Lấy thông tin dịch vụ
            if (!event) {
                return res.status(404).json({ message: 'Không tìm thấy sự kiện!' });
            }
            res.status(200).json(event);
        } catch (error) {
            console.error('Lỗi khi lấy sự kiện:', error.message);
            res.status(500).json({ message: 'Lỗi khi lấy sự kiện!' });
        }
    },

    // Cập nhật sự kiện
    updateEvent: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, date, category, location, services } = req.body;

            // Kiểm tra danh mục
            const existingCategory = await Category.findById(category);
            if (!existingCategory) {
                return res.status(404).json({ message: 'Danh mục không tồn tại!' });
            }

            const updatedEvent = await Event.findByIdAndUpdate(
                id,
                { name, date, category, location, services },
                { new: true } // Trả về sự kiện đã cập nhật
            ).populate('category', 'name');

            if (!updatedEvent) {
                return res.status(404).json({ message: 'Không tìm thấy sự kiện để cập nhật!' });
            }

            res.status(200).json({ message: 'Cập nhật sự kiện thành công!', event: updatedEvent });
        } catch (error) {
            console.error('Lỗi khi cập nhật sự kiện:', error.message);
            res.status(500).json({ message: 'Lỗi khi cập nhật sự kiện!' });
        }
    },

    // Xóa sự kiện
    deleteEvent: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedEvent = await Event.findByIdAndDelete(id);

            if (!deletedEvent) {
                return res.status(404).json({ message: 'Không tìm thấy sự kiện để xóa!' });
            }

            res.status(200).json({ message: 'Xóa sự kiện thành công!' });
        } catch (error) {
            console.error('Lỗi khi xóa sự kiện:', error.message);
            res.status(500).json({ message: 'Lỗi khi xóa sự kiện!' });
        }
    },

    // Thêm dịch vụ vào sự kiện
    addServiceToEvent: async (req, res) => {
        try {
            const { eventId } = req.params;
            const { serviceId, quantity } = req.body;

            const service = await Service.findById(serviceId);
            if (!service) {
                return res.status(404).json({ message: 'Dịch vụ không tồn tại!' });
            }

            const event = await Event.findById(eventId);
            if (!event) {
                return res.status(404).json({ message: 'Sự kiện không tồn tại!' });
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

            const event = await Event.findById(eventId);
            if (!event) {
                return res.status(404).json({ message: 'Sự kiện không tồn tại!' });
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

    // Lấy hoặc tạo hóa đơn
    getInvoiceByEventId: async (req, res) => {
        try {
            const { eventId } = req.params;

            let invoice = await Invoice.findOne({ event: eventId });

            if (!invoice) {
                const event = await Event.findById(eventId).populate('services.service');
                if (!event) {
                    return res.status(404).json({ message: 'Không tìm thấy sự kiện!' });
                }

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
    },
};

export default eventController;
