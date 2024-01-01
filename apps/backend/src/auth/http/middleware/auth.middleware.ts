import jwt from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import { RequestWithUser } from '../../../types/RequestWithUser'

export const authenticateToken = (req: RequestWithUser, res: Response, next: NextFunction) =>  {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err: any, user: any) => {
        console.log(err)
    
        if (err) return res.sendStatus(403)
    
        req.user = user
    
        next()
    })
}