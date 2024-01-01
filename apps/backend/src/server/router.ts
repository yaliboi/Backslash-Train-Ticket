import { Router } from "express";
import { graphRouter } from "../graph/http/graph.router";
const router = Router();

router.get('/', (req, res) => res.json('api is working'))

router.use('/graph', graphRouter)

export default router