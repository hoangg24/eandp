import express from 'express';
import invoiceController from '../controllers/invoiceController.js';

const router = express.Router();

router.post('/create', invoiceController.createInvoice); // Tạo hóa đơn
router.get('/', invoiceController.getAllInvoices); // Lấy tất cả hóa đơn
router.get('/:id', invoiceController.getInvoiceById); // Lấy chi tiết hóa đơn
router.delete('/:invoiceId', invoiceController.deleteInvoiceById);
router.put('/:invoiceId', invoiceController.updateInvoiceById);
export default router;
