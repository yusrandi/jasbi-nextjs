import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'this is users api route' });

    switch (req.method) {
        case 'GET':
        return await getDataById(req, res)
            break;

        case 'DELETE':
            return await deleteData(req, res)
            break;

      
    
        default:
            break;
    }
}

async function getDataById(req: any, res: any){
    const {id} = req.query
    // return res.status(200).json(id)
    try {
        const result = await prisma.product.findFirst({
            where: {
                id: {
                    equals: parseInt(id)
                }
            }
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
        return res.status(500).json(error)
    }
}

async function deleteData(req: any, res: any){
    const {id} = req.query
    // return res.status(200).json(userId)
    try {
        await prisma.product.delete({
            where: {
                id: parseInt(id)
            }
        })
        const result = await prisma.product.findMany()
        return res.status(200).json(
            {
                responsecode : 1,
                responsemsg : 'Data found',
                responsedata : result,
        
            }
        )
    } catch (error) {
        console.log(error);
        
        return res.status(500).json(error)
    }
}
