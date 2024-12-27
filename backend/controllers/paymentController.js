import crypto from 'crypto';
import axios from 'axios';
import Invoice from '../models/invoiceModel.js';
import Payment from '../models/paymentModel.js'; // Import model Payment

// Cấu hình MoMo
var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
var orderInfo = 'pay with MoMo';
var partnerCode = 'MOMO';
var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
var requestType = 'payWithMethod';
var extraData = '';
var orderGroupId = '';
var autoCapture = true;
var lang = 'vi';

const paymentController = {
  // Tạo giao dịch MoMo
  createMoMoPayment: async (req, res) => {
    try {
      const { invoiceId } = req.body;

      // Tìm hóa đơn
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return res.status(404).json({ message: 'Hóa đơn không tồn tại!' });
      }

      const totalAmount = Math.round(invoice.totalAmount); // Lấy amount từ hóa đơn
      if (totalAmount <= 0) {
        throw new Error('Số tiền thanh toán không hợp lệ');
      }

      const orderId = partnerCode + new Date().getTime();
      const requestId = orderId;

      // Tạo chữ ký
      var rawSignature =
        'accessKey=' +
        accessKey +
        '&amount=' +
        totalAmount +
        '&extraData=' +
        extraData +
        '&ipnUrl=' +
        ipnUrl +
        '&orderId=' +
        orderId +
        '&orderInfo=' +
        orderInfo +
        '&partnerCode=' +
        partnerCode +
        '&redirectUrl=' +
        redirectUrl +
        '&requestId=' +
        requestId +
        '&requestType=' +
        requestType;

      const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

      // Gửi yêu cầu đến MoMo
      const requestBody = JSON.stringify({
        partnerCode,
        partnerName: 'Test',
        storeId: 'MomoTestStore',
        requestId,
        amount: totalAmount, // Dùng amount từ hóa đơn
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        autoCapture,
        extraData,
        orderGroupId,
        signature,
      });

      const options = {
        method: 'POST',
        url: 'https://test-payment.momo.vn/v2/gateway/api/create',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody),
        },
        data: requestBody,
      };

      let result;
      try {
        result = await axios(options);

        // Lưu thông tin thanh toán vào database Payment
        const payment = new Payment({
          invoice: invoice._id,
          paymentMethod: 'MoMo',
          amount: totalAmount,
          transactionId: orderId,
          status: 'Pending', // Giao dịch đang chờ xử lý
        });

        await payment.save(); // Lưu vào database

        return res.status(200).json({
          message: 'Tạo giao dịch MoMo thành công',
          payUrl: result.data.payUrl, // URL thanh toán MoMo
          paymentId: payment._id, // Trả về ID giao dịch
        });
      } catch (error) {
        console.error('Payment Error:', error.message);
        return res.status(500).json({
          statusCode: 500,
          message: 'Server error',
        });
      }
    } catch (error) {
      console.error('Error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi tạo thanh toán',
        error: error.message,
      });
    }
  },
  handleMoMoNotification: async (req, res) => {
    try {
        const { orderId, resultCode, amount, message } = req.body;

        // Kiểm tra dữ liệu thông báo
        console.log('Thông báo từ MoMo:', req.body);

        // Tìm thông tin thanh toán dựa trên transactionId (orderId từ MoMo)
        const payment = await Payment.findOne({ transactionId: orderId });
        if (!payment) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin thanh toán' });
        }

        // Kiểm tra số tiền thanh toán có khớp không
        if (payment.amount !== amount) {
            return res.status(400).json({ 
                message: 'Số tiền thanh toán không khớp',
                expectedAmount: payment.amount,
                receivedAmount: amount,
            });
        }

        // Cập nhật trạng thái thanh toán dựa trên resultCode từ MoMo
        payment.status = resultCode === 0 ? 'Completed' : 'Failed';
        await payment.save();

        // Nếu thanh toán thành công, cập nhật trạng thái hóa đơn
        if (resultCode === 0) {
            await Invoice.findByIdAndUpdate(payment.invoice, { status: 'Paid' });
        }

        // Gửi phản hồi tới MoMo
        return res.status(200).json({
            success: true,
            message: 'Xử lý thông báo từ MoMo thành công',
        });
    } catch (error) {
        console.error('Callback Error:', {
            message: error.message,
            stack: error.stack,
        });

        // Gửi lỗi phản hồi tới MoMo
        return res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi xử lý thông báo từ MoMo',
            error: error.message,
        });
    }
},
  getPaymentStatus: async (req, res) => {
  try {
      const { orderId } = req.params;
      const payment = await Payment.findOne({ transactionId: orderId });

      if (!payment) {
          return res.status(404).json({ message: 'Không tìm thấy thông tin thanh toán' });
      }

      return res.status(200).json(payment);
  } catch (error) {
      console.error('Lỗi khi lấy trạng thái thanh toán:', error.message);
      res.status(500).json({ message: 'Có lỗi xảy ra khi lấy trạng thái thanh toán' });
  }
}
};

export default paymentController;
