export type Transaction = {
  id: number;
  description: string;
  amount: number;
  transaction_date: Date;
  user_id: number;
  categorie_id: number;
  categorie_name?: string;
  type: string;
};
