import express from 'express';
const app = express();
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import router from './routes/index.js';
import connectDB from './database/database.js';
import eventRoutes from './routes/eventRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
// Khởi động server
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
// Sử dụng router cho tất cả các route
app.use('/api', router);
app.use('/api/event', eventRoutes);
app.use("/api/services", serviceRoutes);
app.use('/api/invoices', invoiceRoutes);
app.listen(PORT, async () => {
    await connectDB(); // Kết nối với MongoDB
    console.log(`Server is running on http://localhost:${PORT}`);
});