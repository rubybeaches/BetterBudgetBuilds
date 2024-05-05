export type category = {
  category: string;
  help: string[];
  min: number;
  max: number;
  curr: number;
  type: string;
  active: number;
};

export type expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  entryDate: string;
  type: string;
  recurring: boolean;
  linkedAccount: string;
};
