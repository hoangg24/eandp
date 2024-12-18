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
//POST : Thêm dịch vụ vào sự kiện
router.post('/:id/add-service', eventController.addServiceToEvent);
// DELETE: Xóa dịch vụ khỏi sự kiện
router.delete('/:id/remove-service/:serviceName', eventController.deleteServiceFromEvent);
// PUT: Sửa thông tin dịch vụ của sự kiện
router.put('/:id/update-service/:serviceName', eventController.updateServiceInEvent);
// POST: Thêm chi tiết vào dịch vụ
router.post('/:eventId/:serviceName/add-detail', eventController.addDetailToService);
// DELETE: Xóa chi tiết của dịch vụ
router.delete('/:eventId/:serviceName/remove-detail/:detailName', eventController.deleteServiceDetail);
// PUT: Sửa chi tiết của dịch vụ
router.put('/:eventId/:serviceName/update-detail/:detailName', eventController.updateDetailInService);
// GET: Lấy danh sách chi tiết của dịch vụ
router.get('/:eventId/:serviceName/details', eventController.getServiceDetails);


export default router;
