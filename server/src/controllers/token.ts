import { Request, Response } from "express";
import { RefreshToken } from "../types/token";
import { createNewToken } from "../token/token";

export const generateTokenFromRefreshToken = (req: Request, res: Response) => {
  try {
    const refreshTokenData = (req as any).refreshTokenData as RefreshToken;

    const newToken = createNewToken(refreshTokenData.user_id);

    return res.status(200).json({ newToken });
  } catch (error) {
    res.status(500).json({ message: "Erro Interno No Servidor" });
  }
};
