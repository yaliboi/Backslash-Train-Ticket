import { Request, Response } from 'express';
import { queryGraph } from '../logic/queryGraph';
import { FilterOption } from 'types';

export const queryGraphController = async (req: Request, res: Response) => {
    const filters: FilterOption[] = req.body

    if(!Array.isArray(filters)) return res.status(400).json({msg: 'please send an array of filters'})

    const newGraph = queryGraph(filters);

    res.status(200).json(newGraph)
}
