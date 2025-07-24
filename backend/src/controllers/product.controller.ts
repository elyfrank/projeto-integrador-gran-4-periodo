import {Request, Response} from 'express';
import * as productService from '../services/product.service';

export const getProducts = async (_: Request, res: Response) => {
    const products = await productService.getAllProducts();
    res.json(products);
};

export const getProduct = async (req: Request, res: Response) => {
    const product = await productService.getProductById(+req.params.id);
    if (!product) return res.status(404).json({message: 'Produto não encontrado'});
    res.json(product);
};

export const createProduct = async (req: Request, res: Response) => {
    const {name} = req.body;
    const product = await productService.createProduct({name});
    res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
    const {name} = req.body;
    const product = await productService.updateProduct(+req.params.id, {name});
    res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
    await productService.deleteProduct(+req.params.id);
    res.status(204).send();
};