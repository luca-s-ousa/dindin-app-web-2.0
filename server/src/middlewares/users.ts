import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/client";
import { compare } from "bcrypt";

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

export const userAccountDoesNotExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email as string;

  try {
    const findAccount = await prisma.users.findFirst({ where: { email } });

    if (!findAccount)
      return res
        .status(400)
        .json({ message: "O e-mail ou senha informados não são válidos!" });

    (req as any).userAccount = findAccount;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};

export const userPasswordValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const password = req.body.password as string;
  const userAccountPassword = (req as any).userAccount.password!;

  try {
    const validatePassword = await compare(password, userAccountPassword);

    if (!validatePassword)
      return res
        .status(400)
        .json({ message: "O e-mail ou senha informados não são válidos!" });
    next();
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};
