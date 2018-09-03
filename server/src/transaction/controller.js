import { NotFound } from 'http-errors';
import { Op } from 'sequelize';

import Transaction from './model';

import { listQueryWithCount } from '../db/query';

export const get = async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findById(id);
  if (!transaction) {
    throw new NotFound('transaction not exists');
  }
  res.json({ transaction });
};

const searchColumns = [Transaction.tableAttributes.txHash];

export const list = async (req, res) => {
  const { account } = req.query;
  let where = null;
  if (account) {
    where = [
      { fromAccount: account },
      { toAccount: account },
    ];
  }

  const { data, pagination } = await listQueryWithCount(
    Transaction, { ...req.query, where }, searchColumns,
  );
  res.json({ transactions: data, pagination });
};
