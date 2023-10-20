import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/client";
import { compare } from "bcrypt";
import { User } from "../types/user";
import { comparePassword, errorPasswordMessage } from "../utils/functions";
import { Error } from "../types/error";

export const userAccountAlreadyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = String(req.body.email);
    const userLogged = (req as any).userLogged as User;

    if (userLogged && userLogged.email === email) {
      console.log("entrou");
      console.log(userLogged);

      next();
    } else {
      const findAccount = await prisma.users.findFirst({ where: { email } });

      if (findAccount)
        return res.status(400).json({ message: "Essa usuário já existe" });

      next();
    }
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
  const userLogged = (req as any).userLogged as User;

  try {
    if (userLogged) {
      console.log(userLogged);

      await comparePassword(password, userLogged.password!, true);
    } else {
      const { password: passwordAccount } = (req as any).userAccount as User;
      await comparePassword(password, passwordAccount!, false);
    }

    next();
  } catch (error) {
    const errorObj = error as Error;

    if (
      errorObj.message === "Email ou senha incorretos!" ||
      errorObj.message === "A senha informada é diferente da sua senha atual!"
    ) {
      return res.status(400).json({ message: errorObj.message });
    }
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};
