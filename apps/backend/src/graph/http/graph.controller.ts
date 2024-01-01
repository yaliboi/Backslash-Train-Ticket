import { Request, Response } from 'express';
import { queryGraph } from '../logic/queryGraph';
import { FilterOption } from 'types';

export const queryGraphController = async (req: Request, res: Response) => {
    const filters: FilterOption[] = req.body

    //DO VALIDATION ON FILTERS

    const newGraph = queryGraph(filters);

    res.status(200).json(newGraph)
}
