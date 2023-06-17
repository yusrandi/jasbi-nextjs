import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import NextCors from 'nextjs-cors';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'this is users api route' });

    await NextCors(req, res, {
      // Options
      methods: ['GET', 'POST'],
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
   });

    switch (req.method) {
        case 'GET':
            return await getData(req, res)
            break;

        case 'POST':
            return await store(req, res)
            break;
    
        default:
            break;
    }
}

async function getData(req: NextApiRequest, res: NextApiResponse){
    try {
        const ketegoris = await prisma.kategori.findMany({
          select: { id: true, name: true },
          orderBy: [
            {
              name: 'asc',
            }
          ],    
        })
       

        return res.status(200).json(
          {
            responsecode : 1,
            responsemsg : 'Data found',
            responsedata : ketegoris,
    
          }
        )
      
       } catch (error) {
        console.log(error);
        
       }

}
async function store(req: NextApiRequest, res: NextApiResponse){
  const {name} = req.body

    try {
        
        await prisma.kategori.create({
          data: {
            name: name
          }
        })
        const result = await prisma.kategori.findMany({
          select: { id: true, name: true },
        })
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