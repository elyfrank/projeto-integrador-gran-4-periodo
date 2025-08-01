import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

interface CreateSupplierInput {
    name: string;
    cnpj: string;
    address: string;
    phone: string;
    email: string;
    mainContact: string;
}


export const getAllSuppliers = () => prisma.supplier.findMany();
export const getSupplierById = (id: number) => prisma.supplier.findUnique({where: {id}});
export const createSupplier = (data: CreateSupplierInput) => {return prisma.supplier.create({ data });};
export const updateSupplier = (id: number, data: { name?: string }) =>prisma.supplier.update({where: {id}, data});
export const deleteSupplier = (id: number) => prisma.supplier.delete({where: {id}});