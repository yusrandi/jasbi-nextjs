import { NextApiRequest, NextApiResponse } from "next";
import * as bcrypt from 'bcrypt'
import prisma from "../../../../lib/prisma";
import NextCors from 'nextjs-cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'this is users api route' });

    await NextCors(req, res, {
        // Options
        methods: ['POST'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
     });

    switch (req.method) {
        case 'GET':
            // return await getUsers(req, res)
            break;

        case 'POST':
            return await login(req, res)
            break;
    
        default:
            break;
    }
}

async function login(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body;
    console.log({body});
    
    const userExist = await prisma.user.findFirst({
        where:{
            email: body.email
        }
    })
    
    if (!userExist) return res.status(201).json({
        responsecode : 0,
        responsemsg : 'User Tidak Terdaftar',
        responsedata : {},

    })

    if (userExist && (await bcrypt.compare(body.password, userExist.password!))){

        const {password,createdAt,updatedAt, ...userWithoutPass} = userExist
       
        return res.status(201).json({
            responsecode : 1,
            responsemsg : 'Selamat Datang',
            responsedata : userWithoutPass,
        })
    }else{
        return res.status(201).json({
            responsecode : 0,
            responsemsg : 'Email atau password salah!',
            responsedata : {},
        })
    }

    
    
    
}