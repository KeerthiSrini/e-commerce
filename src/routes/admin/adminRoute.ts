import { Request, Response } from 'express';
import { User } from '../../models/userModel';
import { passwordEncrypt } from '../../services/common';
import { PipelineStage } from "mongoose";

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
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
 *           description: The admin's firstName
 *         lastName:
 *           type: string
 *           description: The admin's firstName
 *         email:
 *           type: string
 *           description: The admin's email
 *         password:
 *           type: string
 *           description: The admin's password
 *         mobileNumber:
 *           type: number
 *           description: The admin's mobile number
 *       example:
 *         firstName: John 
 *         lastName: Doe
 *         email: john@example.com
 *         password: password
 *         mobileNumber: 9876543210
 *         gender: female
 *         profilePicture: picture.jpg
 */

/**
 * @swagger
 * /admin/signUp:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       201:
 *         description: Admin Signed Up successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       500:
 *         description: Error in admin sign up
 */

export const adminSignUp = async (req: Request, res: Response) => {
    try {
        req.body.password = await passwordEncrypt(req.body.password);
        const { firstName, lastName, email, password, mobileNumber, gender, profilePicture } = req.body;
        const role = "admin";

        const admin = new User({
            firstName, lastName, email, password, mobileNumber, role, gender, profilePicture
        });

        await admin.save();

        res.status(201).json({
            message: 'Admin Sign Up successfully Completed',
            admin,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error in admin sign up', error });
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
 * /admin/list:
 *   get:
 *     summary: Admin List
 *     tags: [Admin]
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
 *               $ref: '#/components/schemas/Admin'
 *       500:
 *         description: Error in getting admin list 
 */

export const adminList = async (req: Request, res: Response) => {
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

        match.role = "admin";

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
                    Admin: [
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
        const adminDetail = await User.aggregate(aggregation).exec();
        if (!adminDetail[0].count) {
            adminDetail[0].count = 0
        }
        console.log("agg", adminDetail)
        
        res.status(201).json({
            message: 'Admin listed successfully',
            list: adminDetail[0],
        });
    } catch (error) {
        res.status(500).json({ message: 'Error in getting admin list', error });
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
 * /admin/getById:
 *   get:
 *     summary: Admin Detail
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: List Retrived successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       500:
 *         description: Error in getting admin detail 
 */

export const getAdminById = async (req: Request, res: Response) => {
    try {        
        const admin = await User.findOne({
            _id: req.params.id,
            role: "admin",
        });
        
        if (!admin) throw new Error("Admin not found");

        res.status(201).json({
            message: 'Admin Detail Retrived successfully',
            admin,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error in getting admin list', error });
    }
};


/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateAdmin:
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
 *           description: The admin's firstName
 *         lastName:
 *           type: string
 *           description: The admin's firstName
 *         email:
 *           type: string
 *           description: The admin's email
 *         password:
 *           type: string
 *           description: The admin's password
 *         mobileNumber:
 *           type: number
 *           description: The admin's mobile number
 *         status:
 *           type: number
 *           description: The admin's status change
 *       example:
 *         firstName: John 
 *         lastName: Doe
 *         email: john@example.com
 *         password: password
 *         mobileNumber: 9876543210
 *         gender: female
 *         profilePicture: picture.jpg
 *         status: "suspended"
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
 * /admin/updateAdminById:
 *   put:
 *     summary: Admin Update
 *     tags: [Admin]
 *     responses:
 *       201:
 *         description: Admin Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateAdmin'
 *       500:
 *         description: Error in updating admin 
 */

export const updateAdmin = async (req: Request, res: Response) => {
    try {        
        const admin = await User.findOne({
            _id: req.params.id,
            role: "admin",
        });
        
        if (!admin) throw new Error("Admin not found");

        await User.updateOne({
            _id: req.params.id,
        }, req.body);

        res.status(201).json({
            message: 'Admin Updated successfully',
            admin,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error in getting admin list', error });
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
 * /admin/deleteAdminById:
 *   delete:
 *     summary: Admin Delete
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *     responses:
 *       201:
 *         description: Admin Deleted successfully
 *       500:
 *         description: Error in deleting admin 
 */

export const deleteAdmin = async (req: Request, res: Response) => {
    try {        
        const admin = await User.findOne({
            _id: req.params.id,
            role: "admin",
        });
        
        if (!admin) throw new Error("Admin not found");

        await User.updateOne({
            _id: req.params.id,
        }, {
            $set: {
                status: "deleted",
            },
        });

        res.status(201).json({
            message: 'Admin deleted successfully',
            admin,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error in getting admin list', error });
    }
};