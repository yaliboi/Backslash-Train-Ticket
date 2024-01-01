import jwt from 'jsonwebtoken'
import { Request, Response } from 'express';
import { usersRepository } from '../../db/users/users.repository';

export const registerController = async (req: Request, res: Response) => {
    const { username, password } = req.body

    const exists = await usersRepository.get(username)

    if(exists) return res.status(403).json('username already exists')

    await usersRepository.save({password, username})

    const token = generateAccessToken(username, password);
    res.json(token);
}

export const loginController = async (req: Request, res: Response) => {
    const { username, password } = req.body

    const exists = await usersRepository.get(username, password)

    if(!exists) return res.status(404).json('wrong username or password')
    
    const token = generateAccessToken(username, password);
    res.json(token);
} 

const generateAccessToken = (username: string, password: string) => {
    return jwt.sign({ username, password }, process.env.TOKEN_SECRET, { expiresIn: '2h' });
}