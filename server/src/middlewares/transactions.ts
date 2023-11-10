import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma/client";

export const validationCategoryExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { categorieId } = req.body;

  try {
    const findCategorie = await prisma.categories.findFirst({
      where: { id: Number(categorieId) },
    });

    if (!findCategorie) {
      return res.status(404).json({ message: "Categoria não encontrada!" });
    }

    (req as any).categorie = findCategorie;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};

export const validationTypeTransaction = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { type } = req.body;

  try {
    console.log(type === "saida");

    if (type !== "entrada" && type !== "saida") {
      return res.status(400).json({ message: "Tipo de transação inválido!" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};
