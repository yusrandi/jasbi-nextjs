import prisma from "../../../../lib/prisma";
import * as bcrypt from 'bcrypt'


export default async function handler(req: any, res: any) {
    // res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'this is users api route' });

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
        const result = await prisma.user.findFirst({
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
    const {name, address, phone, email, password, role, oldPassword} = req.body
    const {id} = req.query

    let newPassword = oldPassword
    if (password !== '') {
        newPassword = await bcrypt.hash(password, 10)
    }

    try {
        const data = {
            name: name,
            address: address,
            phone: phone,
            // email: email,
            password: newPassword,
            role: role
        }
        await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: data
        
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
        return res.status(500).json(error)
        
    }
}
async function deleteData(req: any, res: any){
    const {id} = req.query
    // return res.status(200).json(userId)
    try {
        await prisma.user.delete({
            where: {
                id: parseInt(id)
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
        
        return res.status(500).json(error)
    }
}
