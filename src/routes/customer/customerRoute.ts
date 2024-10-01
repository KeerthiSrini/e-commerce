import { Request, Response } from 'express';
import { User } from '../../models/userModel';
import { passwordEncrypt } from '../../services/common';
import { PipelineStage } from "mongoose";

/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Customer API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
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
 *           description: The customer's firstName
 *         lastName:
 *           type: string
 *           description: The customer's firstName
 *         email:
 *           type: string
 *           description: The customer's email
 *         password:
 *           type: string
 *           description: The customer's password
 *         mobileNumber:
 *           type: number
 *           description: The customer's mobile number
 *         profilePicture:
 *           type: string
 *           description: The customer's profile picture
 *         country:
 *           type: string
 *           description: The customer's country
 *         state:
 *           type: string
 *           description: The customer's state
 *         city:
 *           type: string
 *           description: The customer's city
 *         address:
 *           type: string
 *           description: The customer's address
 *         gender:
 *           type: string
 *           description: The customer's gender
 *       example:
 *         firstName: John 
 *         lastName: Doe
 *         email: john@example.com
 *         password: password
 *         mobileNumber: 9876543210
 *         profilePicture: password.jpg
 *         country: India
 *         state: Tamil Nadu
 *         city: Karur
 *         address: 123, abc street
 *         gender: female
 */

/**
 * @swagger
 * /customer/signUp:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Customer Signed Up successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Error in customer sign up
 */

export const customerSignUp = async (req: Request, res: Response) => {
    try {
        req.body.password = await passwordEncrypt(req.body.password);
        const { firstName, lastName, email, password, mobileNumber, gender, profilePicture, country, city, state, address } = req.body;
        const role = "customer";

        const customer = new User({
            firstName, lastName, email, password, mobileNumber, role, gender, profilePicture, country, state, address, city
        });

        await customer.save();

        res.status(201).json({
            message: 'Customer Sign Up successfully Completed',
            customer,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error in customer sign up', error });
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
 * /customer/list:
 *   get:
 *     summary: Customer List
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - name: skip
 *         in: query
 *         schema:
 *           type: number
 *       - name: limit
 *         in: query
 *         schema:
 *           type: number
 *       - name: searchtext
 *         in: query
 *         schema:
 *           type: string
 *       - name: role
 *         in: query
 *         schema:
 *           type: string
 *           enum: [customer, admin]
 *       - name: sortorder
 *         in: query
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - name: sortkey
 *         in: query
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, firstName, email]
 *     responses:
 *       201:
 *         description: List Retrived successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Error in getting customer list 
 */

export const customerList = async (req: Request, res: Response) => {
    try {        
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
        const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
        const { searchtext, role, sortorder } = req.query;
        const sortkey: any = req.query.sortkey ? req.query.sortkey : "createdAt";
        const sort: Record<string, | 1 | -1 | { $meta: "textScore" }> = {
            [sortkey]: sortorder ? (sortorder === "DESC" ? -1 : 1) : -1,
        };

        const match: any = {};

        if (searchtext) {
            match.$or = [
                {
                    email: new RegExp(searchtext.toString().replace(/[^a-zA-Z0-9 !@#\$%\^\&*\)\(+=._]/g, ""), "i"),
                },
                {
                    firstName: new RegExp(searchtext.toString().replace(/[^a-zA-Z0-9 !@#\$%\^\&*\)\(+=._]/g, ""), "i"),
                },
                {
                    lastName: new RegExp(searchtext.toString().replace(/[^a-zA-Z0-9 !@#\$%\^\&*\)\(+=._]/g, ""), "i"),
                },
            ];
        }

        if (role) {
            match.role = { $eq: role };
        }

        const aggregation: PipelineStage[] = ([
            {
                $match: match,
            },
            {
                $project: {
                    email: 1,
                    firstName: 1,
                    lastName: 1,
                    fullName: {
                        $concat: ["$firstName", " ", "$lastName"],
                    },
                    country: 1,
                    status: 1,
                    role: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    phoneNumber: 1,
                    profilePicture: 1,
                },
            },
            {
                $sort: sort,
            },
            {
                $facet: {
                    count: [
                        {
                            $count: "count",
                        },
                    ],
                    Customer: [
                        {
                            $skip: skip,
                        },
                        {
                            $limit: limit,
                        },
                    ],
                },
            },
            {
                $addFields: {
                    count: {
                        $arrayElemAt: ["$count.count", 0],
                    },
                },
            },
        ]);
        const customerDetail = await User.aggregate(aggregation).exec();
        if (!customerDetail[0].count) {
            customerDetail[0].count = 0
        }
        console.log("agg", customerDetail)
        
        res.status(201).json({
            message: 'Customer listed successfully',
            list: customerDetail[0],
        });
    } catch (error) {
        res.status(500).json({ message: 'Error in gettingn customer list', error });
    }
};