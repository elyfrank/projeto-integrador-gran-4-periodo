import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = () => prisma.user.findMany();
export const getUserById = (id: number) => prisma.user.findUnique({where: {id}});
export const createUser = (data: { name: string; email: string }) => prisma.user.create({data});
export const updateUser = (id: number, data: { name?: string; email?: string }) =>
    prisma.user.update({where: {id}, data});
export const deleteUser = (id: number) => prisma.user.delete({where: {id}});