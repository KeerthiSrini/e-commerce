import express, { Router } from "express";
import { createProduct } from './productRoute';
import { adminAuthenticator } from "../../middlewares/index";

const router: Router = express.Router();

router.post('/createProduct', adminAuthenticator(), createProduct);
// router.put('/updateProduct', login);
// router.get('/getAllProduct', login);
// router.get('/getProductDetailById', login);
// router.delete('/deleteDeleteById', login);

export default router;
