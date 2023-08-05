
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from 'fs/promises'
import prisma from "../../../lib/prisma";
import NextCors from 'nextjs-cors';

export const config = {
    api: {
        bodyParser: false
    }
}
export default async function handler(req: any, res: any) {
    // res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'this is users api route' });

    await NextCors(req, res, {
        // Options
        methods: ['GET'],
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

function readFile(req: NextApiRequest, saveLocally: boolean) : Promise<{fields: formidable.Fields; files: formidable.Files}> {
    
    const options: formidable.Options = {}

    if (saveLocally) {
        options.uploadDir = path.join(process.cwd(), "/public/products")
        options.filename = (name, ext, path, form) => {
            return path.originalFilename!
        }
    }
    options.maxFileSize = 4000 * 1024 * 1024;

    const form = formidable(options)
    return new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            console.log({fields});
            // console.log({files});
            if (err) reject(err)
            resolve({fields, files})
            try {
                if (parseInt(fields.id.toString()) === 0) {
                    await prisma.product.create({
                        data: {
                            image: fields.imageName.toString(),
                            name: fields.name.toString(),
                            price: parseInt(fields.price.toString()),
                            stock: parseInt(fields.stock.toString()),
                            unit: fields.unit.toString(),
                            description: fields.description.toString(),
                            kategoriId: parseInt(fields.kategoriId.toString())
                        }
                    })
                } else {
                    await prisma.product.update({
                        where: {id: parseInt(fields.id.toString())},
                        data: {
                            image: fields.imageName.toString(),
                            name: fields.name.toString(),
                            price: parseInt(fields.price.toString()),
                            stock: parseInt(fields.stock.toString()),
                            unit: fields.unit.toString(),
                            description: fields.description.toString(),
                            kategoriId: parseInt(fields.kategoriId.toString())
                        }
                    })
                }
                
            } catch (error) {
                console.log({error});
                
            }
        })

    })
}

async function getData(req: NextApiRequest, res: NextApiResponse){
      try {
        const datas = await prisma.product.findMany({
            select: {id: true, image: true, kategoriId: true, name: true, price: true, stock: true, unit: true, description: true, kategori: true},
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
              responsedata : datas,
      
            }
          )
 
         } catch (error) {
            console.log(error);
         }
  
  }
async function store(req: NextApiRequest, res: NextApiResponse){

    try {
        await fs.readdir(path.join(process.cwd() + "/public", "/products"))
    } catch (error) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/products"))
    }
    
    console.log(req.body);
    
      try {
            await readFile(req, true)
            res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'Fake Upload Process' });
        
         } catch (error) {
            console.log(error);
         }
  
  }
