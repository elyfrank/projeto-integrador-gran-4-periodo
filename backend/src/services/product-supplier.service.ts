import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const getSuppliersByProduct = async (productId: number) => {
    const productSuppliers = await prisma.productSupplier.findMany({
        where: {productId},
        include: {supplier: true},
    });
    return productSuppliers.map(ps => ps.supplier);
};

export const createSupplierToProduct = async (productId: number, supplierId: number) => {
    return await prisma.productSupplier.create({
        data: {
            product: {connect: {id: productId}},
            supplier: {connect: {id: supplierId}},
        },
    });
};

export const deteleSupplierProduct = async (productId: number, supplierId: number) => {
    await prisma.productSupplier.delete({
        where: {
            productId_supplierId: {
                productId,
                supplierId,
            },
        },
    });
};