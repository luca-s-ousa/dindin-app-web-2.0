import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma/client";
import dayjs from "dayjs";

export const validationRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshTokenId, userId } = req.body;

    if (!refreshTokenId || !userId) {
      return res.status(401).json({ message: "Não Autorizado!" });
    }

    const searchRefreshToken = await prisma.refresh_token.findFirst({
      where: { id: refreshTokenId, user_id: userId },
    });

    if (!searchRefreshToken) {
      return res.status(401).json({ message: "Não Autorizado!" });
    }

    const expiredRefreshToken = dayjs().isAfter(
      searchRefreshToken.expiresIn * 1000
    );

    // console.log(new Date(searchRefreshToken.expiresIn * 1000).toLocaleString());
    // console.log(new Date().toLocaleString());
    // console.log(dayjs().isAfter(searchRefreshToken.expiresIn * 1000));

    if (expiredRefreshToken)
      return res
        .status(403)
        .json({ message: "Tempo de acesso expirado! Faça o login novamente" });

    (req as any).refreshTokenData = searchRefreshToken;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Erro no servidor" });
  }
};
