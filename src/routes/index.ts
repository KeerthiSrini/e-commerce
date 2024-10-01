
import express, { Router } from "express";
import customerRoute from '../routes/customer';
import authRoute from '../routes/auth';
import cartRoute from '../routes/cart';
import orderRoute from '../routes/order';
import productRoute from '../routes/product';
import adminRoute from '../routes/admin';

const appRouter: Router = express.Router();

appRouter.use('/auth', authRoute);
appRouter.use('/admin', adminRoute);
appRouter.use('/customer', customerRoute);
appRouter.use('/cart', cartRoute);
appRouter.use('/product', productRoute);
appRouter.use('/order', orderRoute);

export default appRouter;
