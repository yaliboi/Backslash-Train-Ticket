import { Router } from 'express';
import { loginController, registerController } from './auth.controllers';

const makeAuthRouter = () => {
    const router = Router();

    router.post('/register', registerController)
    router.post('/login', loginController)
    
    return router
}

export const authRouter = makeAuthRouter()