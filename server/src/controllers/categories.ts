import { Request, Response } from "express";
import { prisma } from "../../prisma/client";

export const listCategories = async (_: Request, res: Response) => {
  try {
    const categories = await prisma.categories.findMany();

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};
