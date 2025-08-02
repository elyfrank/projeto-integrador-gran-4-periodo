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
    try {
        let {
            name,
            description,
            category,
            quantityInStock,
            barcode,
            validityDate,
            imageUrl,
        } = req.body;

        if (!name || !description || !category) {
            return res.status(400).json({message: 'Nome, Descrição e Categoria são obrigatórios.'});
        }

        const parsedBarcode = barcode !== undefined ? Number(barcode) : undefined;
        const parsedCategory = Number(category);
        const parsedQuantity = quantityInStock !== undefined ? Number(quantityInStock) : undefined;
        const parsedValidity = validityDate ? new Date(validityDate) : undefined;

        if (parsedBarcode) {
            const existingBarcode = await productService.findByBarcode(parsedBarcode);
            if (existingBarcode) {
                return res.status(400).json({message: 'Produto com este código de barras já está cadastrado!'});
            }
        }

        const product = await productService.createProduct({
            name,
            description,
            category: parsedCategory,
            quantityInStock: parsedQuantity!,
            barcode: parsedBarcode!,
            validityDate: parsedValidity!,
            imageUrl,
        });

        res.status(201).json(product);
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({message: 'Erro interno ao criar produto.'});
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        let {
            name,
            barcode,
            description,
            categoryId,
            quantityInStock,
            validityDate,
            imageUrl,
        } = req.body;

        // Conversões de tipos
        if (barcode !== undefined) {
            barcode = Number(barcode);
        }

        if (categoryId !== undefined) {
            categoryId = Number(categoryId);
        }

        if (quantityInStock !== undefined) {
            quantityInStock = Number(quantityInStock);
        }

        if (validityDate !== undefined) {
            validityDate = new Date(validityDate);
        }

        const product = await productService.updateProduct(+req.params.id, {
            name,
            barcode,
            description,
            categoryId,
            quantityInStock,
            validityDate,
            imageUrl,
        });

        res.json(product);
    } catch (error) {
        console.error('Erro ao atualizar o produto:', error);
        res.status(500).json({message: 'Erro interno ao atualizar o produto.'});
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        await productService.deleteProduct(+req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar o produto:', error);
        res.status(500).json({message: 'Erro interno ao deletar o produto.'});
    }
};