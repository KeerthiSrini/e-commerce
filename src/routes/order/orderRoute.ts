import { Request, Response } from 'express';
import { Order } from '../../models/orderModel';
import { passwordMatchCheck, generateLoginResponse } from '../../services/orderService';

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateOrder:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *         totalAmount:
 *           type: number
 *         shippingAddress:
 *           type: object
 *           properties:
 *           items:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               zipcode:
 *                 type: string
 *               country:
 *                 type: string
 *       example:
 *         items:
 *           - productId: "12345"
 *             name: "Product A"
 *             price: 100
 *             quantity: 2
 *           - productId: "67890"
 *             name: "Product B"
 *             price: 150
 *             quantity: 1
 *         totalAmount: 400
 *         shippingAddress: {
 *              street: "123, abc street",
 *              city: Karur,
 *              zipcode: 639004,
 *              country: India
 *         }
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
 * /order/createOrder:
 *   post:
 *     summary: Add new Order
 *     tags: [Order]
 *     parameters:
 *       - name: paymentMethod
 *         in: query
 *         schema:
 *           type: string
 *           enum: ['credit_card' , 'net_banking' , 'cash_on_delivery']
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrder'
 *     responses:
 *       201:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Error in creating Order
 */

export const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = req.headers.authorization
        const { items, totalAmount, shippingAddress } = req.body;
        const paymentMethod = req.query.paymentMethod

        const order = new Order({
            items, totalAmount, shippingAddress, paymentMethod, userId
        });

        await order.save();

        res.status(201).json({
            message: 'Order added successfully',
            order,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error in creating order', error });
    }
};
