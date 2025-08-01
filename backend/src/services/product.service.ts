import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProducts = () => prisma.product.findMany();
export const getProductById = (id: number) => prisma.product.findUnique({where: {id}});
export const createProduct = (data: { name: string; description: string; category: number | string }) => {
    return prisma.product.create({
        data: {
            name: data.name,
            description: data.description,
            category: {
                connect: {
                    id: Number(data.category),
                },
            },
        },
    });
};

export const updateProduct = (id: number, data: { name?: string; barcode?: string; description?: string; categoryId?: number }) =>
    prisma.product.update({where: {id}, data});

export const deleteProduct = (id: number) => prisma.product.delete({where: {id}});