import express from "express";
import { routers } from "./routes";

const app = express();

app.use(express.json());

app.use(routers);

app.listen(() => console.log("Server listening on port 8800"));
