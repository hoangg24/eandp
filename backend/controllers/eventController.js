import Event from '../models/eventModel.js';
import ServiceDetail from '../models/servicedetailModel.js';

// Thêm sự kiện mới
const eventController ={
    createEvent : async (req, res) => {
    try {
        const { name, date,category, location, services } = req.body;

        // Validate dữ liệu
        if (!name || !date || !category|| !location || !services || !Array.isArray(services)) {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ!' });
        }

        // Tạo sự kiện mới
        const newEvent = new Event({
            name,
            date,
            category,
            location,
            services,
        });

        await newEvent.save();
        res.status(201).json({ message: 'Sự kiện đã được tạo thành công!', event: newEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm sự kiện!' });
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
        const event = await Event.findById(id); // Lấy sự kiện theo ID
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
        const { name, date, location, services } = req.body;

        // Validate dữ liệu
        if (!name || !date || !location || !services || !Array.isArray(services)) {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ!' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { name, date, location, services },
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
        const { id } = req.params; // ID của sự kiện
        const { name, quantity } = req.body; // Dữ liệu dịch vụ

        // Validate dữ liệu
        if (!name || !quantity) {
            return res.status(400).json({ message: 'Dữ liệu dịch vụ không hợp lệ!' });
        }

        // Tìm và cập nhật sự kiện
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Không tìm thấy sự kiện!' });
        }

        // Thêm dịch vụ vào mảng services
        event.services.push({ name, quantity });

        // Lưu sự kiện
        await event.save();

        res.status(200).json({ message: 'Thêm dịch vụ thành công!', event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi thêm dịch vụ!' });
    }
},
    updateServiceInEvent : async (req, res) => {
    try {
        const { id, serviceName } = req.params; // ID sự kiện và tên dịch vụ cần sửa
        const { name, quantity } = req.body; // Dữ liệu mới cho dịch vụ

        // Tìm sự kiện theo ID
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Không tìm thấy sự kiện!' });
        }

        // Tìm dịch vụ cần sửa
        const service = event.services.find((service) => service.name === serviceName);
        if (!service) {
            return res.status(404).json({ message: 'Không tìm thấy dịch vụ!' });
        }

        // Cập nhật thông tin dịch vụ
        if (name) service.name = name;
        if (quantity) service.quantity = quantity;

        // Lưu sự kiện sau khi cập nhật
        await event.save();

        res.status(200).json({ message: 'Cập nhật dịch vụ thành công!', event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật dịch vụ!' });
    }
},
    addDetailToService : async (req, res) => {
    try {
        const { eventId, serviceName } = req.params; // ID sự kiện và tên dịch vụ
        const { name, description } = req.body; // Thông tin chi tiết cần thêm

        // Validate dữ liệu
        if (!name) {
            return res.status(400).json({ message: 'Tên chi tiết là bắt buộc!' });
        }

        // Tìm hoặc tạo mới chi tiết dịch vụ cho sự kiện
        let serviceDetail = await ServiceDetail.findOne({ eventId, serviceName });
        if (!serviceDetail) {
            serviceDetail = new ServiceDetail({ eventId, serviceName, details: [] });
        }

        // Thêm chi tiết mới
        serviceDetail.details.push({ name, description });

        // Lưu chi tiết dịch vụ
        await serviceDetail.save();

        res.status(200).json({ message: 'Thêm chi tiết thành công!', serviceDetail });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi thêm chi tiết!' });
    }
},
    getServiceDetails : async (req, res) => {
    try {
        const { eventId, serviceName } = req.params;

        // Tìm chi tiết dịch vụ theo sự kiện và tên dịch vụ
        const serviceDetail = await ServiceDetail.findOne({ eventId, serviceName });
        if (!serviceDetail) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết của dịch vụ!' });
        }

        res.status(200).json(serviceDetail);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết dịch vụ!' });
    }
},
    deleteServiceFromEvent : async (req, res) => {
    try {
        const { id, serviceName } = req.params; // ID sự kiện và tên dịch vụ cần xóa

        // Tìm sự kiện theo ID
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Không tìm thấy sự kiện!' });
        }

        // Xóa dịch vụ khỏi danh sách
        event.services = event.services.filter((service) => service.name !== serviceName);

        // Lưu sự kiện sau khi cập nhật
        await event.save();

        res.status(200).json({ message: 'Xóa dịch vụ thành công!', event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa dịch vụ!' });
    }
},
    deleteServiceDetail : async (req, res) => {
    try {
        const { eventId, serviceName, detailName } = req.params; // ID sự kiện, tên dịch vụ, và tên chi tiết

        // Tìm chi tiết dịch vụ
        const serviceDetail = await ServiceDetail.findOne({ eventId, serviceName });
        if (!serviceDetail) {
            return res.status(404).json({ message: 'Không tìm thấy dịch vụ!' });
        }

        // Xóa chi tiết khỏi danh sách
        serviceDetail.details = serviceDetail.details.filter((detail) => detail.name !== detailName);

        // Lưu thay đổi
        await serviceDetail.save();

        res.status(200).json({ message: 'Xóa chi tiết thành công!', serviceDetail });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa chi tiết!' });
    }
},
    updateDetailInService : async (req, res) => {
    try {
        const { eventId, serviceName, detailName } = req.params;
        const { name, description } = req.body;

        // Tìm dịch vụ theo eventId và serviceName
        const serviceDetail = await ServiceDetail.findOne({ eventId, serviceName });
        if (!serviceDetail) {
            return res.status(404).json({ message: 'Không tìm thấy dịch vụ!' });
        }

        // Tìm chi tiết cần chỉnh sửa
        const detail = serviceDetail.details.find(detail => detail.name === detailName);
        if (!detail) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết!' });
        }

        // Cập nhật thông tin
        if (name) detail.name = name;
        if (description) detail.description = description;

        // Lưu lại dữ liệu
        await serviceDetail.save();

        res.status(200).json({ message: 'Cập nhật chi tiết thành công!', serviceDetail });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật chi tiết!' });
    }
}

}
export default eventController;






