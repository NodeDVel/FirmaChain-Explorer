import { simpleRequester } from './common';
import {
  EXECUTED_TX,
  LIB,
  PENDING_TX,
  REVERT_BLOCK,
  TAIL_BLOCK,
} from '../const';
import { NODE_ENDPOINT } from '../../config';


const preProcess = (result, maxResponse) => {
  const data = result.split('\n');
  data.pop();
  let restart = false;

  if (data.length >= maxResponse) restart = true;
  return {
    datum: data.length !== 0 ? JSON.parse(data[data.length - 1]).result : null,
    restart,
  };
};

const jsonfy = (data) => {
  const postData = data.substring(1, data.length - 1).split(/, |:/);
  const result = {};
  for (let i = 0; i < postData.length; i += 2) {
    result[postData[i]] = postData[i + 1];
  }
  return result;
};

const distributor = (datum, actionTypes) => {
  const data = jsonfy(datum.data);
  switch (datum.topic) {
    case EXECUTED_TX:
      return {
        type: actionTypes.GET_EXECUTED_TX,
        payload: data,
      };
    case LIB:
      return {
        type: actionTypes.GET_LIB,
        payload: data,
      };
    case PENDING_TX:
      return {
        type: actionTypes.GET_PENDING_TX,
        payload: data,
      };
    case REVERT_BLOCK:
      return {
        type: actionTypes.GET_REVERT_BLOCK,
        payload: data,
      };
    case TAIL_BLOCK:
      return {
        type: actionTypes.GET_TAIL_BLOCK,
        payload: data,
      };
    default:
      return null;
  }
};

// post: "/v1/subscribe"
// TODO @ggomma add error handler;
export const subscriber = (dispatch, actionTypes, ERROR) => {
  const req = new XMLHttpRequest();
  req.open('POST', `${NODE_ENDPOINT}/v1/subscribe`);
  req.onprogress = () => {
    const data = preProcess(req.responseText, 10);
    if (data.datum !== null) dispatch(distributor(data.datum, actionTypes));
    if (data.restart === true) {
      req.abort();
      return subscriber(dispatch, actionTypes);
    }
    return null;
  };
  req.onerror = () => dispatch({
    type: ERROR,
    payload: 'Error occured while subscribing',
  });
  req.send(JSON.stringify({
    topics: [
      EXECUTED_TX,
      LIB,
      PENDING_TX,
      REVERT_BLOCK,
      TAIL_BLOCK,
    ],
  }));
};


// get: "/v1/block"
// params: "hash[hash, 'genesis', 'confirmed', 'tail']"
export const blockGetter = (dispatch, actionType, ERROR, hash) => simpleRequester(dispatch, {
  url: `${NODE_ENDPOINT}/v1/block`,
  params: {
    hash,
  },
  actionType,
  ERROR,
});

// get: "/v1/blocks"
// params: "from, to"
export const blocksGetter = (
  dispatch,
  actionType,
  ERROR,
  { from, to },
) => simpleRequester(dispatch, {
  url: `${NODE_ENDPOINT}/v1/blocks`,
  params: {
    from,
    to,
  },
  actionType,
  ERROR,
});

// get: "/v1/user/accountstate"
// params: "address / height[number, 'genesis', 'confirmed', 'tail']"
export const accGetter = (dispatch, actionType, ERROR, address) => simpleRequester(dispatch, {
  url: `${NODE_ENDPOINT}/v1/user/accountstate`,
  params: {
    address,
    height: 'tail',
  },
  actionType,
  ERROR,
});

// get: "/v1/user/accounts"
export const accsGetter = (dispatch, actionType, ERROR) => simpleRequester(dispatch, {
  url: `${NODE_ENDPOINT}/v1/user/accounts`,
  actionType,
  ERROR,
});


// get: "/v1/node/medstate"
export const medStateGetter = (dispatch, actionType, ERROR) => simpleRequester(dispatch, {
  url: `${NODE_ENDPOINT}/v1/node/medstate`,
  actionType,
  ERROR,
});

// get: "/v1/transaction"
// params: "hash"
export const txGetter = (dispatch, actionType, ERROR, hash) => simpleRequester(dispatch, {
  url: `${NODE_ENDPOINT}/v1/transaction`,
  params: {
    hash,
  },
  actionType,
  ERROR,
});
