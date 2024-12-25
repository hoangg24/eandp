import qs from 'qs';
import crypto from 'crypto';
import Invoice from '../models/invoiceModel.js';
import moment from 'moment';

const paymentController = {
    createPayment: async (req, res) => {
        try {
            const { invoiceId } = req.body;

            // Kiểm tra hóa đơn
            const invoice = await Invoice.findById(invoiceId);
            if (!invoice) {
                return res.status(404).json({ message: 'Hóa đơn không tồn tại!' });
            }

            const amount = invoice.totalAmount; // Tổng tiền
            const ipAddr = req.ip || '127.0.0.1'; // IP khách hàng

            const vnp_Params = {
                vnp_Version: '2.1.0',
                vnp_Command: 'pay',
                vnp_TmnCode: process.env.VNP_TMNCODE,
                vnp_Locale: 'vn',
                vnp_CurrCode: 'VND',
                vnp_TxnRef: `${invoiceId}-${Date.now()}`, // ID giao dịch duy nhất
                vnp_OrderInfo: `Thanh toán hóa đơn ${invoiceId}`,
                vnp_OrderType: 'billpayment',
                vnp_Amount: Math.round(amount * 100).toString(), // VNPay yêu cầu nhân 100
                vnp_ReturnUrl: process.env.VNP_RETURNURL,
                vnp_IpAddr: ipAddr,
                vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
            };

            // Sắp xếp tham số
            const sortedParams = Object.keys(vnp_Params)
                .sort()
                .reduce((acc, key) => {
                    acc[key] = vnp_Params[key];
                    return acc;
                }, {});

            // Tạo chữ ký
            const signData = Object.entries(sortedParams)
                .map(([key, value]) => `${key}=${value}`)
                .join('&');

            const hmac = crypto.createHmac('md5', process.env.VNP_HASHSECRET.trim());
            const signed = hmac.update(signData).digest('hex');
            sortedParams['vnp_SecureHash'] = signed;

            // Tạo URL thanh toán
            const paymentUrl = `${process.env.VNP_URL}?${qs.stringify(sortedParams, { encode: true })}`;

            res.status(200).json({ paymentUrl });
        } catch (error) {
            console.error('Error in createPayment:', error);
            res.status(500).json({ message: 'Lỗi máy chủ khi tạo thanh toán!' });
        }
    },

    vnpayReturn: (req, res) => {
        try {
            const vnp_Params = req.query;
            const secureHash = vnp_Params['vnp_SecureHash'];

            // Xóa các tham số không dùng để ký
            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            // Sắp xếp tham số
            const sortedParams = Object.keys(vnp_Params)
                .sort()
                .reduce((acc, key) => {
                    acc[key] = vnp_Params[key];
                    return acc;
                }, {});

            // Tạo chữ ký để xác minh
            const signData = qs.stringify(sortedParams, { encode: false });
            const hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET.trim());
            const signed = hmac.update(signData).digest('hex');

            // Kiểm tra chữ ký
            if (secureHash === signed) {
                if (vnp_Params['vnp_ResponseCode'] === '00') {
                    res.status(200).json({ message: 'Thanh toán thành công!' });
                } else {
                    res.status(400).json({ message: 'Thanh toán không thành công!' });
                }
            } else {
                res.status(400).json({ message: 'Chữ ký không hợp lệ!' });
            }
        } catch (error) {
            console.error('Error in vnpayReturn:', error);
            res.status(500).json({ message: 'Lỗi máy chủ khi xử lý callback!' });
        }
    },
};

export default paymentController;
