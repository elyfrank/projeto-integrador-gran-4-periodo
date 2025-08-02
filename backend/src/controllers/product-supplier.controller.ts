import {Request, Response} from 'express';
import * as productSupplierService from '../services/product-supplier.service';

export const getSuppliersByProduct = async (req: Request, res: Response) => {
    const product = Number(req.params.product);

    if (!product) {
        return res.status(400).json({message: 'Produto inválido'});
    }

    try {
        const suppliers = await productSupplierService.getSuppliersByProduct(product);
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({message: 'Erro interno ao buscar associação de fornecedor com o produto.'});
    }
};

export const createSupplierToProduct = async (req: Request, res: Response) => {
    const {product, supplier} = req.body;

    if (!product || !supplier) {
        return res.status(400).json({message: 'Produto e Fornecedor são obrigatórios'});
    }

    try {
        const parsedProduct = Number(product);
        const parsedSupplier = Number(supplier);
        const association = await productSupplierService.createSupplierToProduct(parsedProduct, parsedSupplier);
        res.status(201).json(association);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({message: 'Associação já existe'});
        }
        res.status(500).json({message: 'Erro interno ao associar fornecedor com o produto.'});
    }
};

export const deteleSupplierProduct = async (req: Request, res: Response) => {
    const {product, supplier} = req.body;

    if (!product || !supplier) {
        return res.status(400).json({message: 'Produto e Fornecedor são obrigatórios'});
    }

    try {
        const parsedProduct = Number(product);
        const parsedSupplier = Number(supplier);
        await productSupplierService.deteleSupplierProduct(parsedProduct, parsedSupplier);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({message: 'Erro interno ao deletar a associação do fornecedor com o produto.'});
    }
};
