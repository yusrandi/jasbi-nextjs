import prisma from "../../../../lib/prisma";

export default async function handler(req: any, res: any) {
    // res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'this is users api route' });

    switch (req.method) {
        case 'GET':
        return await getDataById(req, res)
            break;
            
       
    
        default:
            break;
    }
}

async function getDataById(req: any, res: any){
    const {id} = req.query
    // return res.status(200).json(id)
    try {
        const result = await prisma.notifikasi.findMany({
            select:{id:true, datetime: true, status: true, transaksi: {
                select: {id: true, datetime: true, transaksiCode: true, customerId: true, customer: true, productId: true, product: true, qty: true, total: true, file: true, status: true},
              },},
            where: {
                transaksi: {
                    customerId: parseInt(id)
                }
            },
            orderBy: {
                datetime: 'desc'
            }
        })
        return res.status(200).json({
            responsecode : 1,
            responsemsg : 'Data found',
            responsedata : result,
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json(error)
    }
}
async function update(req: any, res: any){
    const {name} = req.body
    const {id} = req.query

    try {
        const data = {
            name: name
        }
        await prisma.kategori.update({
            where: {
                id: parseInt(id)
            },
            data: data
        
        })
        const result = await prisma.kategori.findMany()

        return res.status(200).json(
            {
                responsecode : 1,
                responsemsg : 'Data found',
                responsedata : result,
        
              }
        )

    } catch (error) {
        return res.status(500).json(error)
        
    }
}
async function deleteData(req: any, res: any){
    const {id} = req.query
    // return res.status(200).json(userId)
    try {
        await prisma.kategori.delete({
            where: {
                id: parseInt(id)
            }
        })
        const result = await prisma.kategori.findMany()
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
