import express, { Router } from "express";
import { login } from './cartRoute';

const router: Router = express.Router();

router.post('/addItemToCart', login);
router.put('/updateItemInCart', login);
router.get('/getAllItemInCart', login);
router.get('/getItemInCartById', login);
router.delete('/deleteIntemInCartById', login);

export default router;
