import BigNumber from 'bignumber.js';
import Account from './model';
import logger from '../logger';
import {
  requestAccountBalance, requestAccountStakingBalance,
} from '../utils/requester';


const getAccountFromDB = (address, t) => Account
  .findOrCreate({ where: { address }, transaction: t })
  .then(accounts => accounts[0]);

// eslint-disable-next-line import/prefer-default-export
export const updateTxToAccounts = async (rawTx, t) => {
  const {
    fromAccount: from, toAccount: to, executed,
  } = rawTx;
  const fromAccount = await getAccountFromDB(from, t);
  const fromAccountBalance = await requestAccountBalance(from);
  const fromAccountStakingBalance = await requestAccountStakingBalance(from);

  const plist = [
    fromAccount.update({
      totalTxs: fromAccount.totalTxs + 1,
      balance: new BigNumber(fromAccountBalance || 0).toString(),
      staking: new BigNumber(fromAccountStakingBalance || 0).toString(),
    }, { transaction: t }),
  ];
  if (executed && to) {
    const toAccount = await getAccountFromDB(to, t);
    const toAccountBalance = await requestAccountBalance(to);
    const toAccountStakingBalance = await requestAccountStakingBalance(from);
    plist.push(toAccount.update({
      totalTxs: toAccount.totalTxs + 1,
      balance: new BigNumber(toAccountBalance || 0).toString(),
      staking: new BigNumber(toAccountStakingBalance || 0).toString(),
    }, { transaction: t }));
  }
  return Promise
    .all(plist)
    .catch(() => {
      logger.error(`failed to update tx to accounts ${rawTx.hash}`);
    });
};
