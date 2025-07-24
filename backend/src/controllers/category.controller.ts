import {Request, Response} from 'express';
import * as categoryService from '../services/category.service';

export const getCategories = async (_: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
};