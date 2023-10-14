import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/client";

export const userAccountAlreadyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = String(req.body.email);

    const findAccount = await prisma.users.findFirst({ where: { email } });

    if (findAccount)
      return res.status(400).json({ message: "Essa usuário já existe" });

    next();
  } catch (error) {
    return res.status(500).json({ message: "Erro Interno no Servidor" });
  }
};
