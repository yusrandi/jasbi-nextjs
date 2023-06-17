import { PrismaClient } from "prisma/prisma-client";
import * as bcrypt from 'bcrypt'
import prisma from "../../../lib/prisma";
import { signJwtAccesToken } from "../../../lib/jwt";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'this is users api route' });

    

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
    console.log(body);
    
    const user = await prisma.user.findFirst({
        where: {
            email: body.email,
        }
    })

    console.log({user});

    if (user && (await bcrypt.compare(body.password, user.password!))){
                const {password,createdAt,updatedAt, ...userWithoutPass} = user
        
                const accessToken = signJwtAccesToken(userWithoutPass)
                const result = {
                    ...userWithoutPass, accessToken
                }
        
                res.status(201).json(result)
                // return new Response(JSON.stringify(result))
            }else res.status(201).json(null)
}


interface RequestBody{
    email: string;
    password: string;
}
// export async function POST(request:Request) {
//     const body: RequestBody = await request.json();
//     console.log(body);
    
//     const user = await prisma.user.findFirst({
//         where: {
//             email: body.email
//         }
//     })

//     console.log({user});


//     if (user && (await bcrypt.compare(body.password, user.password!))){
//         const {password,createdAt,updatedAt, ...userWithoutPass} = user

//         const accessToken = signJwtAccesToken(userWithoutPass)
//         const result = {
//             ...userWithoutPass, accessToken
//         }

//         return new Response(JSON.stringify(result))
//     }else return new Response(JSON.stringify(null))
// }