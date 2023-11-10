import { Router } from "express";
import {
  userAccountAlreadyExists,
  userAccountDoesNotExist,
  userPasswordValidation,
} from "./middlewares/users";
import {
  detailUser,
  login,
  registerNewUser,
  updateUser,
} from "./controllers/users";
import { validationAuth } from "./middlewares/authentication";
import { validationRefreshToken } from "./middlewares/token";
import { generateTokenFromRefreshToken } from "./controllers/token";
import {
  validationCategoryExists,
  validationTypeTransaction,
} from "./middlewares/transactions";
import { registerNewTransaction } from "./controllers/transactions";

const routers = Router();

routers.post("/cadastro", userAccountAlreadyExists, registerNewUser);
routers.post("/login", userAccountDoesNotExist, userPasswordValidation, login);
routers.get("/detalhar-usuario", validationAuth, detailUser);
routers.put(
  "/atualizar-usuario",
  validationAuth,
  userAccountAlreadyExists,
  userPasswordValidation,
  updateUser
);

routers.post(
  "/refresh-token",
  validationRefreshToken,
  generateTokenFromRefreshToken
);

routers.post(
  "/transaction",
  validationAuth,
  validationTypeTransaction,
  validationCategoryExists,
  registerNewTransaction
);

export { routers };
