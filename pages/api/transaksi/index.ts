
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from 'fs/promises'
import prisma from "../../../lib/prisma";
import { Status } from "prisma/prisma-client";
import CurrentDateTime from "../../../utils/currentdatetime";

export const config = {
    api: {
        bodyParser: false
    }
}
export default async function handler(req: any, res: any) {
    // res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'this is users api route' });

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

function readFile(req: NextApiRequest, res: NextApiResponse, saveLocally: boolean) : Promise<{fields: formidable.Fields; files: formidable.Files}> {
    
    const options: formidable.Options = {}

    if (saveLocally) {
        options.uploadDir = path.join(process.cwd(), "/public/transaksi")
        options.filename = (name, ext, path, form) => {
            return path.originalFilename!
        }
    }
    options.maxFileSize = 4000 * 1024 * 1024;

    const form = formidable(options)
    return new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            console.log({fields});
            console.log({files});
            console.log({err});
            // console.log(fields.stock.toString());
            
            if (err) reject(err)
            let status: Status = fields.status as Status
            try {
             
                if (parseInt(fields.id.toString()) === 0) {

                  const existingData =  await prisma.transaksi.findFirst({
                    select: {id: true, datetime: true, transaksiCode: true, customerId: true, customer: true, productId: true, product: true, qty: true, total: true, file: true, status: true},
                    where:{
                      status: status,
                      customerId: parseInt(fields.customerId.toString()),
                      productId: parseInt(fields.productId.toString())
                    }
                  }) 

                  if (existingData) {
                    return res.status(200).json(
                      {
                        responsecode : 0,
                        responsemsg : 'Product Telah Dikeranjang',
                        responsedata : [existingData],
                
                      }
                    )
                  }

                  const transaksi = await prisma.transaksi.create({
                    data: {
                        transaksiCode: createId(),
                        datetime: CurrentDateTime(),
                        file: fields.imageName.toString(),
                        status: status,
                        qty: parseInt(fields.qty.toString()),
                        total: parseInt(fields.total.toString()),
                        customerId: parseInt(fields.customerId.toString()),
                        productId: parseInt(fields.productId.toString())
                    }
                  })

                  console.log({transaksi});
                  

                  await prisma.notifikasi.create({
                        data:{
                          datetime: CurrentDateTime(),
                          transaksiId: transaksi.id,
                          status: status
                        }
                  })

                } else {
                    await prisma.transaksi.update({
                        where: {id: parseInt(fields.id.toString())},
                        data: {
                          datetime: CurrentDateTime(),
                          file: fields.imageName.toString(),
                          status: status,
                          qty: parseInt(fields.qty.toString()),
                          total: parseInt(fields.total.toString()),
                          customerId: parseInt(fields.customerId.toString()),
                          productId: parseInt(fields.productId.toString())
                        }
                    })

                    await prisma.notifikasi.create({
                        data:{
                          datetime: CurrentDateTime(),
                          transaksiId: parseInt(fields.id.toString()),
                          status: status
                        }
                  })
                }
                
            resolve({fields, files})

            } catch (error) {
                console.log({error});
                
            }
        })

    })
}

async function getData(req: NextApiRequest, res: NextApiResponse){

  
  // res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: CurrentDateTime() });


      try {
        const datas = await prisma.transaksi.findMany({
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
              responsedata : datas,
      
            }
          )
 
         } catch (error) {
            console.log(error);
         }
  
  }
async function store(req: NextApiRequest, res: NextApiResponse){


    try {
        await fs.readdir(path.join(process.cwd() + "/public", "/transaksi"))
    } catch (error) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/transaksi"))
    }
    
    
      try {
            
            await readFile(req, res, true)
            
            const datas = await prisma.transaksi.findMany({
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
                  responsedata : datas,
          
                }
              )

         } catch (error) {
            console.log(error);
         }
  
  }
  const createId = () => {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 10; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };
