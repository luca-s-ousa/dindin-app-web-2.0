import jwt from "jsonwebtoken";
import { hash } from "bcrypt";
import { Request, Response } from "express";
import { User } from "../types/user";
import { prisma } from "../../prisma/client";

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
