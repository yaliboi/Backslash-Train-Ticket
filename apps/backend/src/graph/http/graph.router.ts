import { Router } from 'express';
import { queryGraphController } from './graph.controller';

const makeGraphRouter = () => {
    const router = Router();

    router.post('/', queryGraphController)
    
    return router
}

export const graphRouter = makeGraphRouter()