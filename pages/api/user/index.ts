import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import * as bcrypt from 'bcrypt'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'this is users api route' });

    switch (req.method) {
        case 'GET':
            return await getUsers(req, res)
            break;

        case 'POST':
          return await store(req, res)
            break;
    
        default:
            break;
    }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse){
    try {
        const users = await prisma.user.findMany({
          select: { id: true, name: true, email: true, role: true, address: true, phone: true },
          orderBy: [
            {
              role: 'asc',
            }
          ],    
        })
       

        return res.status(200).json({
            responsecode : 1,
            responsemsg : 'Users found',
            responsedata : users,
    
        })
      
       } catch (error) {
        console.log(error);
        
       }

}

async function store(req: NextApiRequest, res: NextApiResponse){
  const {name, address, phone, email, password, role} = req.body

      try {
        const userExist = await prisma.user.findFirst({
          where:{
              email: email
          }
      })

      
      if (userExist) return res.status(201).json({
          responsecode : 0,
          responsemsg : 'Email Telah Tersedia',
          responsedata : {},

      })

        await prisma.user.create({
          data: {
            name: name,
            address: address,
            phone: phone,
            email: email,
            password: await bcrypt.hash(password, 10),
            role: role

          }
        })
        const result = await prisma.user.findMany()
        return res.status(200).json(
          {
            responsecode : 1,
            responsemsg : 'Data found',
            responsedata : result,
    
          }
        )
      
       } catch (error) {
        console.log(error);
        
       }

}