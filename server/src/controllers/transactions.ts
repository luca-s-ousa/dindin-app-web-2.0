import { Request, Response, response } from "express";
import { User } from "../types/user";
import { prisma } from "../../prisma/client";
import { Categorie } from "../types/categorie";

export const registerNewTransaction = async (req: Request, res: Response) => {
  const { id: userId } = (req as any).userLogged as User;
  const { id: categorieId, description: categorieName } = (req as any)
    .categorie as Categorie;
  const { type, description, amount } = req.body;

  try {
    const newTransaction = await prisma.transactions.create({
      data: {
        description,
        amount,
        type: String(type),
        user_id: userId!,
        categorie_id: categorieId!,
      },
    });

    const dateCreatedTransaction = new Date(
      newTransaction.transaction_date
    ).toISOString();

    const responseData = {
      id: newTransaction.id,
      type,
      amount: Number(amount),
      description,
      transaction_date: dateCreatedTransaction,
      userId,
      categorieId,
      cateorieName: categorieName,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor!" });
  }
};
