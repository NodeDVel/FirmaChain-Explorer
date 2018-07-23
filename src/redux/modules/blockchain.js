import { createAction, handleActions } from 'redux-actions';

import {
  accGetter,
  accDetailGetter,
  accsGetter,
  blockGetter,
  blocksGetter,
  medStateGetter,
  subscriber,
  txGetter,
} from '../helpers/blockchain';
import { sorter } from '../../lib';


// ACTION TYPES
const GET_MED_STATE = 'blockchain/GET_MED_STATE';

const GET_ACCOUNT = 'blockchain/GET_ACCOUNT';
const GET_ACCOUNTS = 'blockchain/GET_ACCOUNTS';
const GET_ACCOUNT_DETAIL = 'blockchain/GET_ACCOUNT_DETAIL';
const SET_ACCOUNT = 'blockchain/SET_ACCOUNT';

const GET_BLOCK = 'blockchain/GET_BLOCK';
const GET_BLOCKS = 'blockchain/GET_BLOCKS';
const GET_LIB = 'blockchain/GET_LIB';
const GET_REVERT_BLOCK = 'blockchain/GET_REVERT_BLOCK';
const GET_TAIL_BLOCK = 'blockchain/GET_TAIL_BLOCK';
const SET_BLOCK = 'blockchain/SET_BLOCK';

const GET_EXECUTED_TX = 'blockchain/GET_EXECUTED_TX';
const GET_PENDING_TX = 'blockchain/GET_PENDING_TX';
const GET_TX = 'blockchain/GET_TX';
const SET_TX = 'blockchain/SET_TX';
const SET_TXS = 'blockchain/SET_TXS';

const SUBSCRIBE = 'blockchain/SUBSCRIBE';

const ERROR = 'blockchain/ERROR';

const subsribeTypes = {
  GET_EXECUTED_TX,
  // GET_LIB,
  // GET_PENDING_TX,
  // GET_REVERT_BLOCK,
  GET_TAIL_BLOCK,
};

const initialState = {
  medState: null,
  totalSupply: 10000000000,

  account: null, // specific account
  accounts: [], // all accounts on the blockchain

  block: null, // specific block
  blockList: [], // blocks from rpc call
  blocks: [], // blocks from event subscriber
  lib: null, // lib from event subscriber
  revertBlocks: [], // revert blocks from event subscriber
  tailBlock: null, // tail block from event subscriber

  pendingTxs: [], // pending txs from event subscriber
  tx: null, // specific tx
  txList: [], // transaction list set from local
  txs: [], // executed txs from event subscriber
  txsFromBlock: [], // txs included in the specific block

  subscribe: false,

  error: null,
};

// REDUCER
const reducer = handleActions({
  [GET_MED_STATE]: (state, action) => ({ ...state, medState: action.payload }),

  [GET_ACCOUNT]: (state, action) => ({ ...state, account: action.payload }),
  [GET_ACCOUNTS]: (state, action) => ({ ...state, accounts: sorter(action.payload.accounts, 'balance') }),
  [GET_ACCOUNT_DETAIL]: (state, action) => ({ ...state, txList: sorter(action.payload.transactions, 'timestamp') }),
  [SET_ACCOUNT]: (state, action) => ({ ...state, account: action.payload }),

  [GET_BLOCK]: (state, action) => ({ ...state, block: action.payload }),
  [GET_BLOCKS]: (state, action) => ({ ...state, blockList: sorter(action.payload.blocks, 'height') }),
  [GET_LIB]: (state, action) => ({ ...state, lib: action.payload }),
  [GET_REVERT_BLOCK]: (state, action) => ({
    ...state,
    revertBlocks: [...state.revertBlocks, action.payload],
  }),
  [GET_TAIL_BLOCK]: (state, action) => ({
    ...state,
    tailBlock: action.payload,
    blocks: sorter([...state.blocks, action.payload], 'height').slice(0, 5),
    txsFromBlock: action.payload.transactions ? (
      [...action.payload.transactions, ...state.txsFromBlock]
    ) : (
      state.txsFromBlock
    ),
  }),
  [SET_BLOCK]: (state, action) => ({ ...state, block: action.payload }),

  [GET_EXECUTED_TX]: (state, action) => ({
    ...state,
    txs: sorter([...state.txs, action.payload].slice(0, 5), 'timestamp'),
  }),
  [GET_PENDING_TX]: (state, action) => ({
    ...state,
    pendingTxs: [...state.pendingTxs, action.payload],
  }),
  [GET_TX]: (state, action) => ({ ...state, tx: action.payload }),
  [SET_TX]: (state, action) => ({ ...state, tx: action.payload }),
  [SET_TXS]: (state, action) => ({
    ...state,
    txList: sorter(action.payload, 'timestamp', -1),
  }),

  [SUBSCRIBE]: state => ({ ...state, subscribe: true }),

  [ERROR]: (state, action) => ({ ...state, error: action.payload }),
}, initialState);


// ACTION CREATORS
export const getAccount = address => dispatch => accGetter(dispatch, GET_ACCOUNT, ERROR, address);
export const getAccountDetail = address => dispatch => accDetailGetter(
  dispatch,
  GET_ACCOUNT_DETAIL,
  ERROR,
  address,
);
export const getAccounts = () => dispatch => accsGetter(dispatch, GET_ACCOUNTS, ERROR);
export const getBlock = hash => dispatch => blockGetter(dispatch, GET_BLOCK, ERROR, hash);
export const getBlocks = ({ from, to }) => dispatch => blocksGetter(
  dispatch,
  GET_BLOCKS,
  ERROR,
  { from, to },
);
export const getMedState = () => dispatch => medStateGetter(dispatch, GET_MED_STATE, ERROR);
export const getTx = hash => dispatch => txGetter(dispatch, GET_TX, ERROR, hash);
export const setAccount = createAction(SET_ACCOUNT);
export const setTx = createAction(SET_TX);
export const setTxs = createAction(SET_TXS);
export const setBlock = createAction(SET_BLOCK);
export const subscribe = () => dispatch => subscriber(dispatch, subsribeTypes, ERROR);


export default reducer;
