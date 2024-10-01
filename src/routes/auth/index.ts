import express, { Router } from "express";
import { login, logout } from './authRoute';

const router: Router = express.Router();

router.post('/login', login);
router.post('/logout', logout);

export default router;
