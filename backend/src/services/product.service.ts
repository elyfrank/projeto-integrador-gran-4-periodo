import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProducts = () => prisma.product.findMany({ include: { category: true } });
export const getProductById = (id: number) => prisma.product.findUnique({ where: { id }, include: { category: true } });
export const createProduct = (data: {
    name: string;
    description: string;
    category: number;
    quantityInStock: number;
    barcode: number;
    validityDate: Date;
    imageUrl: string;
}) => {
    return prisma.product.create({
        data: {
            name: data.name,
            description: data.description,
            category: {
                connect: {
                    id: data.category,
                },
            },
            quantityInStock: data.quantityInStock,
            barcode: data.barcode,
            validityDate: data.validityDate,
            imageUrl: data.imageUrl,
        },
    });
};

export const updateProduct = (id: number, data: {
    name?: string;
    barcode?: number;
    description?: string;
    categoryId?: number;
    quantityInStock?: number;
    validityDate?: Date;
    imageUrl?: string;
}) =>
    prisma.product.update({where: {id}, data});

export const deleteProduct = (id: number) => prisma.product.delete({where: {id}});

export const findByBarcode = (barcode: number) => {
    return prisma.product.findUnique({
        where: {barcode},
    });
};