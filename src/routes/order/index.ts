import express, { Router } from "express";
import { createOrder } from './orderRoute';

const router: Router = express.Router();

router.post('/createOrder', createOrder);
// router.put('/updateOrderDetail', login);
// router.get('/getAllOrderDetail', login);
// router.get('/getOrderDetailsById', login);
// router.delete('/deleteOrderDetailById', login);

export default router;
