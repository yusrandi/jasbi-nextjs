export default function handler(req: any, res: any) {
    console.log(req.body);
    
    res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'Fake Upload Process' });
}
