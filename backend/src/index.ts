import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import tryOnRoutes from "./routes/tryOn.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

import path from "path";
import uploadRoutes from "./routes/upload.routes.js";
import ugcRoutes from "./routes/ugc.routes.js";

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/try-on", tryOnRoutes);
app.use("/payments", paymentRoutes);
app.use("/admin", adminRoutes);
app.use("/upload", uploadRoutes);
app.use("/ugc", ugcRoutes);

// Servir arquivos estáticos (uploads)
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Luna Maria Kids API is running" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export default app;
