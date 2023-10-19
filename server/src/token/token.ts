import jwt from "jsonwebtoken";
import { jwtPass } from "../jwt_pass";
import { prisma } from "../../prisma/client";
import dayjs from "dayjs";

export const createNewToken = (clientId: number) => {
  const token = jwt.sign({ clientId }, jwtPass, { expiresIn: "30s" });
  return token;
};

export const createNewRefreshToken = async (clientId: number) => {
  const expiresIn = dayjs().add(2, "minutes").unix();

  const refreshToken = await prisma.refresh_token.create({
    data: { user_id: clientId, expiresIn },
  });

  const newToken = createNewToken(clientId);
  return { token: newToken, refreshTokenId: refreshToken.id };
};
