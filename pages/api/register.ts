import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import prismadb from '@/lib/prismadb'
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req:NextApiRequest, res: NextApiResponse) {
    console.log("Database URL:", process.env.DATABASE_URL);
    if(req.method !== 'POST'){
        return res.status(405).end()
    }    

    try{
        const {email, name, password} = req.body;

        // Imprimir los datos recibidos
    console.log('Received data:', {email, name, password});
        const existingUser = await prismadb.user.findUnique({
            where:{
                email,
            }
        });

        if(existingUser){
            return res.status(422).json({error:'Email taken'})
        }

        const hashedPassword = await bcrypt.hash(password,12);
        const user = await prismadb.user.create({
            data: {
                email,
                name,
                hashedPassword,
                image: '',
                emailVerified: new Date(),
            }
        })
        
        return res.status(200).json(user);
    }catch(error){
        console.log(error)
        console.log("Database URL:", process.env.DATABASE_URL);
        return res.status(400).end()
    }


}
