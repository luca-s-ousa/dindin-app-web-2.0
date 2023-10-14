import { Router } from "express";
import { helloController } from "./controllers/hello";

const routers = Router();

routers.get("/hello", helloController);

export { routers };
