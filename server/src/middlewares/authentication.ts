import { NextFunction, Request, Response } from "express";
import { Error } from "../types/error";
import jwt, { verify } from "jsonwebtoken";
import { jwtPass } from "../jwt_pass";
import { Token, TokenDecode } from "../types/token";
import dayjs from "dayjs";
import { prisma } from "../../prisma/client";

export const validationAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).json({ message: "Não autorizado!" });

  const token = authorization.split(" ")[1];

  try {
    const { clientId } = verify(token, jwtPass) as Token;

    const user = await prisma.users.findFirst({ where: { id: clientId } });

    if (!user) return res.status(401).json({ message: "Não autorizado" });

    (req as any).userLogged = user;

    next();
  } catch (error) {
    const errorObj = error as Error;

    if (errorObj.message === "jwt expired") {
      return res
        .status(401)
        .json({ message: "Tempo de acesso expirado! Efetue o login!" });
    }

    return res.status(500).json({ message: errorObj.message });
  }
};
