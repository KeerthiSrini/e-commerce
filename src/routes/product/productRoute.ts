import { Request, Response } from 'express';
import { Product } from '../../models/productModel';

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProduct:
 *       type: object
 *       required:
 *         - productName
 *         - productDescription
 *         - image
 *         - originalPrice
 *       properties:
 *         productName:
 *           type: string
 *           description: The product name
 *         productDescription:
 *           type: string
 *           description: The product description
 *         image:
 *           type: string
 *           description: The image
 *         originalPrice:
 *           type: number
 *           description: The original price
 *         discountPrice:
 *           type: number
 *           description: The discount price
 *         sellingPrice:
 *           type: number
 *           description: The selling price
 *         unitOfMeasure:
 *           type: number
 *           description: no of unit
 *         hsnCode:
 *           type: string
 *           description: HSN COde
 *       example:
 *         productName: Towel 
 *         productDescription: Red Towel
 *         image: towel.jpg
 *         originalPrice: 120
 *         discountPrice: 20
 *         sellingPrice: 100 
 *         unitOfMeasure: 1
 *         hsnCode: T01
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
 * /product/createProduct:
 *   post:
 *     summary: Create a New Product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProduct'
 *     responses:
 *       201:
 *         description: Product Added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error in adding Product
 */

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { productName, productDescription, image, originalPrice, discountPrice, sellingPrice, unitOfMeasure, hsnCode } = req.body;

        const product = new Product({
            productName, productDescription, image, originalPrice, discountPrice, sellingPrice, unitOfMeasure, hsnCode
        });

        await product.save();

        res.status(201).json({
            message: 'Product added successfully',
            product,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error in adding product', error });
    }
};
