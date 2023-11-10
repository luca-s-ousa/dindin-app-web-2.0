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
import {
  listTransactions,
  registerNewTransaction,
} from "./controllers/transactions";
import { listCategories } from "./controllers/categories";

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

routers.get("/categories", validationAuth, listCategories);

routers.post(
  "/transaction",
  validationAuth,
  validationTypeTransaction,
  validationCategoryExists,
  registerNewTransaction
);

routers.get("/transactions", validationAuth, listTransactions);

export { routers };
