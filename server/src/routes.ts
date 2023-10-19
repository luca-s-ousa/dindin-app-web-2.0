import { Request, Response, Router } from "express";
import {
  userAccountAlreadyExists,
  userAccountDoesNotExist,
  userPasswordValidation,
} from "./middlewares/users";
import { login, registerNewUser, routerProtected } from "./controllers/users";
import { validationAuth } from "./middlewares/authentication";
import { validationRefreshToken } from "./middlewares/token";
import { generateTokenFromRefreshToken } from "./controllers/token";

const routers = Router();

routers.post("/user", userAccountAlreadyExists, registerNewUser);
routers.post("/login", userAccountDoesNotExist, userPasswordValidation, login);
routers.get(
  "/router-protected",
  validationAuth,
  (req: Request, res: Response) => {
    const resfreshToken = (req as any).refreshToken;

    const dataResponse = { message: "Tudo Certo" };

    if (!resfreshToken) return res.status(200).json({ ...dataResponse });

    return res.status(200).json({ resfreshToken, message: "Tudo Certo" });
  }
);

routers.post(
  "/refresh-token",
  validationRefreshToken,
  generateTokenFromRefreshToken
);

export { routers };
