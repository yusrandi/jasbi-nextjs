import { NextApiRequest, NextApiResponse } from "next";
import * as bcrypt from 'bcrypt'
import prisma from "../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'this is users api route' });

    switch (req.method) {
        case 'GET':
            // return await getUsers(req, res)
            break;

        case 'POST':
            return await register(req, res)
            break;
    
        default:
            break;
    }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse){

    return res.status(200).json({"hello": "Hello World"})

}

async function register(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body;
    const userExist = await prisma.user.findFirst({
        where:{
            email: body.email
        }
    })

    
    if (userExist) return res.status(201).json({
        responsecode : 0,
        responsemsg : 'Email Telah Tersedia',
        responsedata : {},

    })

    const user = await prisma.user.create({
        data: {
            name: body.name,
            address: body.address,
            phone: body.phone,
            email: body.email,
            role: body.role,
            password: await bcrypt.hash(body.password, 10),
        }
    })

    const {password, createdAt,updatedAt, ...result} = user
    
    return res.status(201).json({
        responsecode : 1,
        responsemsg : 'User Created',
        responsedata : result,
    })
    
}