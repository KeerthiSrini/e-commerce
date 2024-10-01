import express, { Router } from "express";
import { adminList, adminSignUp, deleteAdmin, getAdminById, updateAdmin } from './adminRoute';

const router: Router = express.Router();

router.post('/signUp', adminSignUp);
router.get('/list', adminList);
router.put('/updateAdminById', updateAdmin);
router.get('/getById', getAdminById);
router.delete('/deleteAdminById', deleteAdmin);

export default router;
