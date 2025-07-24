import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import supplierRoutes from "./routes/supplier.routes";
import productSupplierRoutes from './routes/product-supplier.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/product-supplier', productSupplierRoutes);

export default app;