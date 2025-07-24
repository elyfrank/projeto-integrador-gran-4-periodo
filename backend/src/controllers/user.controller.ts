import {Request, Response} from 'express';
import * as userService from '../services/user.service';

export const getUsers = async (_: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
    const user = await userService.getUserById(+req.params.id);
    if (!user) return res.status(404).json({message: 'Usuário não encontrado'});
    res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
    const {name, email} = req.body;
    const user = await userService.createUser({name, email});
    res.status(201).json(user);
};

export const updateUser = async (req: Request, res: Response) => {
    const {name, email} = req.body;
    const user = await userService.updateUser(+req.params.id, {name, email});
    res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
    await userService.deleteUser(+req.params.id);
    res.status(204).send();
};