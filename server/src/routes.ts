import { Router } from "express";
import { userAccountAlreadyExists } from "./middlewares/users";
import { registerNewUser } from "./controllers/users";

const routers = Router();

routers.post("/user", userAccountAlreadyExists, registerNewUser);

export { routers };
