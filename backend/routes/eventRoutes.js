import express from 'express';
import eventController from '../controllers/eventController.js';

const router = express.Router();

// POST: Thêm sự kiện
router.post('/create', eventController.createEvent);
// GET: Lấy danh sách sự kiện
router.get('/', eventController.getEvents);
// GET: Lấy sự kiện theo ID
router.get('/:id', eventController.getEventById);
// PUT: Cập nhật sự kiện
router.put('/:id', eventController.updateEvent);
// DELETE: Xóa sự kiện
router.delete('/:id', eventController.deleteEvent);
router.post('/:eventId/add-service', eventController.addServiceToEvent);
// Route xóa dịch vụ
router.delete('/:eventId/remove-service/:serviceId', eventController.removeServiceFromEvent);
// Route cập nhật dịch vụ
router.put('/:eventId/update-service/:serviceId', eventController.updateServiceInEvent);
router.get('/:eventId/invoice', eventController.getInvoiceByEventId);
export default router;