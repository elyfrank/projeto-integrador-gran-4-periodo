import {Request, Response} from 'express';
import * as productSupplierService from '../services/product-supplier.service';

export const getSuppliersByProduct = async (req: Request, res: Response) => {
    const productId = Number(req.params.productId);

    if (!productId) {
        return res.status(400).json({message: 'Produto inválido'});
    }

    try {
        const suppliers = await productSupplierService.getSuppliersByProduct(productId);
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({message: 'Erro interno'});
    }
};

export const addSupplierToProduct = async (req: Request, res: Response) => {
    const {productId, supplierId} = req.body;

    if (!productId || !supplierId) {
        return res.status(400).json({message: 'productId e supplierId são obrigatórios'});
    }

    try {
        const association = await productSupplierService.addSupplierToProduct(productId, supplierId);
        res.status(201).json(association);
    } catch (error: any) {
        if (error.code === 'P2002') { // Unique constraint failed
            return res.status(409).json({message: 'Associação já existe'});
        }
        res.status(500).json({message: 'Erro interno', detail: error.message});
    }
};

export const deteleSupplierProduct = async (req: Request, res: Response) => {
    const {productId, supplierId} = req.body;

    if (!productId || !supplierId) {
        return res.status(400).json({message: 'Produto e Fornecedor são obrigatórios'});
    }

    try {
        await productSupplierService.deteleSupplierProduct(productId, supplierId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({message: 'Erro interno'});
    }
};
