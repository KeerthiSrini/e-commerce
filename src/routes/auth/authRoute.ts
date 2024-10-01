import { Request, Response } from 'express';
import { User } from '../../models/userModel';
import { passwordMatchCheck, generateLoginResponse } from '../../services/authService';
import { passwordEncrypt } from '../../services/common';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *         email: john@example.com
 *         password: securepassword
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login as any type user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       201:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Error in user login
 */

export const login = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        });

        if (!user) throw new Error("User Not Found");

        const isValid = await passwordMatchCheck(req.body.password, user.password);
        if (!isValid) throw new Error("You have entered an invalid username/password.");

        const token = await generateLoginResponse(user);

        res.status(201).json({
            message: 'User Logged In successfully',
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error in user sign up', error });
    }
};

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT 
 * 
 * security:
 *   - bearerAuth: []  
 * 
 * /auth/logout:
 *   post:
 *     summary: Logout API
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       201:
 *         description: User Logged Out successfully
 *       500:
 *         description: Error in logging
 */

export const logout = async (req: Request, res: Response) => {
    try {
        req.body.password = await passwordEncrypt(req.body.password);
        const { firstName, lastName, email, password, mobileNumber } = req.body;
        const role = req.query.role;

        const user = new User({
            firstName, lastName, email, password, mobileNumber, role
        });

        await user.save();

        res.status(201).json({
            message: 'User Sign Up successfully Completed',
            user,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error in user sign up', error });
    }
};
