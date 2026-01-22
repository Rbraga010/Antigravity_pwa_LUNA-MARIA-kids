import express from 'express';
import cors from 'cors';
import authRoutes from '../backend/src/routes/auth.routes';
import productRoutes from '../backend/src/routes/product.routes';
import orderRoutes from '../backend/src/routes/order.routes';
import tryOnRoutes from '../backend/src/routes/tryOn.routes';
import paymentRoutes from '../backend/src/routes/payment.routes';
import adminRoutes from '../backend/src/routes/admin.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/try-on', tryOnRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Luna Maria Kids API is running' });
});

export default app;
