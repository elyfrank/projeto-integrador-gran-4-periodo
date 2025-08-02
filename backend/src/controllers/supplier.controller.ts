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
        let {name, cnpj, address, phone, email, mainContact} = req.body;

        // Validação simples dos campos obrigatórios
        if (!name || !cnpj || !address || !phone || !email || !mainContact) {
            return res.status(400).json({message: 'Todos os campos são obrigatórios.'});
        }

        cnpj = sanitizeCnpj(cnpj);
        const existingSupplier = await supplierService.findByCnpj(cnpj);
        if (existingSupplier) {
            return res.status(400).json({message: 'Fornecedor com esse CNPJ já está cadastrado!'});
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
        res.status(500).json({message: 'Erro interno ao criar fornecedor.'});
    }
};

export const updateSupplier = async (req: Request, res: Response) => {
    try {
        const {name, cnpj, address, phone, email, mainContact} = req.body;
        const supplier = await supplierService.updateSupplier(+req.params.id, {
            name,
            cnpj,
            address,
            phone,
            email,
            mainContact
        });
        res.json(supplier);
    } catch (error) {
        console.error('Erro ao atualizar fornecedor:', error);
        res.status(500).json({message: 'Erro interno ao atualizar fornecedor.'});
    }

};

export const deleteSupplier = async (req: Request, res: Response) => {
    try {
        await supplierService.deleteSupplier(+req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar fornecedor:', error);
        res.status(500).json({message: 'Erro interno ao deletar fornecedor.'});
    }
};

export const sanitizeCnpj = (cnpj: string): string => {
    return cnpj.replace(/\D/g, '');
};