import {Request, Response} from 'express';
import * as supplierService from '../services/supplier.service';

export const getSuppliers = async (_: Request, res: Response) => {
    const suppliers = await supplierService.getAllSuppliers();
    res.json(suppliers);
};

export const getSupplier = async (req: Request, res: Response) => {
    const supplier = await supplierService.getSupplierById(+req.params.id);
    if (!supplier) return res.status(404).json({message: 'Fornecedor não encontrado'});
    res.json(supplier);
};

export const createSupplier = async (req: Request, res: Response) => {
    try {
        const { name, cnpj, address, phone, email, mainContact } = req.body;

        // Validação simples dos campos obrigatórios
        if (!name || !cnpj || !address || !phone || !email || !mainContact) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        const supplier = await supplierService.createSupplier({
            name,
            cnpj,
            address,
            phone,
            email,
            mainContact,
        });

        res.status(201).json(supplier);
    } catch (error) {
        console.error('Erro ao criar fornecedor:', error);
        res.status(500).json({ message: 'Erro interno ao criar fornecedor.' });
    }
};

export const updateSupplier = async (req: Request, res: Response) => {
    const {name} = req.body;
    const supplier = await supplierService.updateSupplier(+req.params.id, {name});
    res.json(supplier);
};

export const deleteSupplier = async (req: Request, res: Response) => {
    await supplierService.deleteSupplier(+req.params.id);
    res.status(204).send();
};