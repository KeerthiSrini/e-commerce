import express, { Router } from "express";
import { customerList, customerSignUp } from './customerRoute';

const router: Router = express.Router();

router.post('/signUp', customerSignUp);
router.get('/list', customerList);

export default router;
