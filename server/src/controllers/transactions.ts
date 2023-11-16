import { Request, Response, response } from "express";
import { User } from "../types/user";
import { prisma } from "../../prisma/client";
import { Categorie } from "../types/categorie";
import { Transaction } from "../types/transaction";

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
        transaction_date: new Date(),
      },
    });

    return res
      .status(200)
      .json({ ...newTransaction, categorie_name: categorieName });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor!" });
  }
};

export const listTransactions = async (req: Request, res: Response) => {
  const user = (req as any).userLogged as User;
  const filters = req.query.filter as string[];

  try {
    const userTransactions = await prisma.transactions.findMany({
      where: { user_id: user.id },
      include: {
        categorie: { select: { description: true } },
      },
    });

    const transactions = userTransactions.map((transaction) => {
      const { categorie, ...dataTransaction } = transaction;
      return {
        ...dataTransaction,
        categorie_name: transaction.categorie.description,
      };
    });

    if (filters) {
      const filterCategoriesFormaters = filters.map((categorie) => {
        return categorie.replace(/-/g, " ");
      });

      const filterTransactions = transactions.filter((transaction) => {
        if (
          filterCategoriesFormaters.includes(
            transaction.categorie_name.toLocaleLowerCase()
          )
        ) {
          return transaction;
        }
      });

      return res.status(200).json(filterTransactions);
    }

    return res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor!" });
  }
};

export const detailTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = (req as any).transaction as Transaction;

    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor!" });
  }
};

export const editTransaction = async (req: Request, res: Response) => {
  const { categorieId, type, description, amount } = req.body;
  const { id: user_id } = (req as any).userLogged as User;
  const id = Number(req.params.id);

  try {
    await prisma.transactions.update({
      data: {
        categorie_id: categorieId,
        type,
        description,
        amount,
        transaction_date: new Date(),
      },
      where: {
        id: id,
        user_id,
      },
    });

    return res.status(200).json({ message: "Dados atualizados" });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor!" });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const userLogged = (req as any).userLogged as User;
  const id = Number(req.params.id);
  try {
    await prisma.transactions.delete({
      where: {
        id: id,
        user_id: userLogged.id,
      },
    });

    return res.status(200).json({ message: "Transação excluída com sucesso!" });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};

export const extractOfTransactions = async (req: Request, res: Response) => {
  const { id } = (req as any).userLogged as User;
  let totalExitValue = 0;
  let totalEntryValue = 0;

  const transactions = await prisma.transactions.findMany({
    where: { user_id: id },
  });

  try {
    transactions.map((transaction) => {
      if (transaction.type === "entrada") {
        totalEntryValue += transaction.amount;
      } else {
        totalExitValue += transaction.amount;
      }
    });

    return res.status(200).json({
      inputs: totalEntryValue,
      outputs: totalExitValue,
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor!" });
  }
};
