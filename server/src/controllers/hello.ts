import { Request, Response } from "express";

export const helloController = (_: Request, res: Response) => {
  return res.json({ message: "Hello World" });
};
