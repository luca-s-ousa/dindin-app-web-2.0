import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { User } from "../types/user";

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

export const validationTransactionExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userLogged = (req as any).userLogged as User;
    const id = Number(req.params.id);

    const findTransaction = await prisma.transactions.findFirst({
      where: { id, user_id: userLogged.id },
      include: {
        categorie: {
          select: { description: true },
        },
      },
    });

    if (!findTransaction) {
      return res.status(404).json({ message: "Transação não encontrada!" });
    }

    const categorie_name = findTransaction.categorie.description;

    const { categorie, ...dataTransaction } = findTransaction;

    (req as any).transaction = { ...dataTransaction, categorie_name };

    next();
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};
