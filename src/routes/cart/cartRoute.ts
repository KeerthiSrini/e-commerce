import { Request, Response } from 'express';
import { User } from '../../models/userModel';
import { passwordMatchCheck, generateLoginResponse } from '../../services/cartService';

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - mobileNumber
 *       properties:
 *         firstName:
 *           type: string
 *           description: The user's firstName
 *         lastName:
 *           type: string
 *           description: The user's firstName
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *         mobileNumber:
 *           type: number
 *           description: The user's mobile number
 *       example:
 *         firstName: John 
 *         lastName: Doe
 *         email: john@example.com
 *         password: password
 *         mobileNumber: 9876543210
 */

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
 * /cart/addItemToCart:
 *   post:
 *     summary: Login as any type user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: [] 
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
