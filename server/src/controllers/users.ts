import jwt from "jsonwebtoken";
import { hash } from "bcrypt";
import { Request, Response } from "express";
import { User } from "../types/user";
import { prisma } from "../../prisma/client";
import { jwtPass } from "../jwt_pass";
import { createNewRefreshToken, createNewToken } from "../token/token";

export const registerNewUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body as Omit<User, "id">;

  try {
    const encryptedPassword = await hash(password!, 8);

    const newUser = await prisma.users.create({
      data: { email, name, password: encryptedPassword },
    });

    const userCreated = newUser as Omit<User, "password">;

    return res.status(200).json(userCreated);
  } catch (error) {
    return res.status(500).json({ message: "Erro Interno no Servidor" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { id: clientId } = (req as any).userAccount as Omit<User, "password">;
  try {
    const authData = await createNewRefreshToken(clientId!);

    return res.status(200).json({ ...authData, clientId });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};

export const detailUser = async (req: Request, res: Response) => {
  const { password, ...userLogged } = (req as any).userLogged as User;
  try {
    return res.status(200).json({ ...userLogged });
  } catch (error) {
    return res.status(500).json({ message: "Erro Interno no Servidor" });
  }
};
