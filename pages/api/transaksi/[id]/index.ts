import prisma from "../../../../lib/prisma";
import NextCors from 'nextjs-cors';

export default async function handler(req: any, res: any) {
    // res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'this is users api route' });

    await NextCors(req, res, {
        // Options
        methods: ['GET', 'PUT', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
     });

    switch (req.method) {
        case 'GET':
        return await getDataById(req, res)
            break;
            
        case 'PUT':
                return await update(req, res)
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
        const result = await prisma.transaksi.findFirst({
            where: {
                id: {
                    equals: parseInt(id)
                }
            }
        })
        return res.status(200).json(result)
    } catch (error) {
        console.log(error);
        
        return res.status(500).json(error)
    }
}
async function update(req: any, res: any){
    const {name} = req.body
    const {id} = req.query

    try {
        // const data = {
        //     name: name
        // }
        // await prisma.transaksi.update({
        //     where: {
        //         id: parseInt(id)
        //     },
        //     data: data
        
        // })
        // const result = await prisma.transaksi.findMany()

        // return res.status(200).json(
        //     {
        //         responsecode : 1,
        //         responsemsg : 'Data found',
        //         responsedata : result,
        
        //       }
        // )

    } catch (error) {
        return res.status(500).json(error)
        
    }
}
async function deleteData(req: any, res: any){
    const {id} = req.query
    // return res.status(200).json(id)
    try {

        await prisma.notifikasi.deleteMany({
            where:{
                transaksiId: parseInt(id)
            }
        })
        await prisma.transaksi.delete({

            where: {
                id: parseInt(id)
            }
        })
        
        const result = await prisma.transaksi.findMany({
          select: {id: true, datetime: true, transaksiCode: true, customerId: true, customer: true, productId: true, product: true, qty: true, total: true, file: true, status: true},
          orderBy: [
            {
              datetime: 'desc',
            }
          ],    
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
