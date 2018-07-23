import { createAction, handleActions } from 'redux-actions';


// ACTION TYPES
const SET_WINDOW_SIZE = 'global/SET_WINDOW_SIZE';

const SET_SEARCH_TEXT = 'global/SET_SEARCH_TEXT';

const OPEN_LANGUAGE = 'global/OPEN_LANGUAGE';
const OPEN_NAVBAR = 'global/OPEN_NAVBAR';

const CLOSE_MODAL = 'global/CLOSE_MODAL';
const OPEN_MODAL = 'global/OPEN_MODAL';

const CHANGE_LANGUAGE = 'global/CHANGE_LANGUAGE';

const MOVE_PAGE = 'global/MOVE_PAGE';

const MOVE_URL = 'global/MOVE_URL';

const initialState = {
  // Mode - 0 : Desktop, 1 : Tablet, 2 : Mobile
  mode: 0,
  width: null,

  search: '',

  languageOpen: false,
  navBarOpen: false,

  modalData: null,
  modalOpen: false,
  modalType: null,

  language: 'en',

  page: 1,

  currentUrl: '/',
};

// REDUCER
const reducer = handleActions({
  [SET_WINDOW_SIZE]: (state, action) => {
    const width = action.payload;
    let mode = 0;
    if (width < 800) {
      mode = 2;
    } else if (width < 1200) {
      mode = 1;
    } else {
      mode = 0;
    }
    return {
      ...state,
      width,
      mode,
      navBarOpen: false,
      languageOpen: mode === 2,
    };
  },

  [SET_SEARCH_TEXT]: (state, action) => ({ ...state, search: action.payload }),

  [OPEN_LANGUAGE]: state => ({ ...state, languageOpen: !state.languageOpen }),
  [OPEN_NAVBAR]: state => ({ ...state, navBarOpen: !state.navBarOpen }),

  [CLOSE_MODAL]: state => ({
    ...state,
    modalOpen: false,
  }),
  [OPEN_MODAL]: (state, action) => ({
    ...state,
    modalData: action.payload && action.payload.modalData,
    modalOpen: true,
    modalType: action.payload && action.payload.modalType,
  }),

  [CHANGE_LANGUAGE]: (state, action) => ({
    ...state,
    language: action.payload,
    languageOpen: false,
  }),

  [MOVE_PAGE]: (state, action) => {
    let page = action.payload;
    if (page < 1) page = 1;
    return { ...state, page };
  },

  [MOVE_URL]: (state, action) => ({
    ...state,
    currentUrl: action.payload,
  }),
}, initialState);

// ACTION CREATORS
export const changeLanguage = createAction(CHANGE_LANGUAGE);
export const closeModal = createAction(CLOSE_MODAL);
export const movePage = createAction(MOVE_PAGE);
export const moveUrl = createAction(MOVE_URL);
export const openLanguage = createAction(OPEN_LANGUAGE);
export const openModal = createAction(OPEN_MODAL); // { modalData, modalType }
export const openNavBar = createAction(OPEN_NAVBAR);
export const setSearchText = createAction(SET_SEARCH_TEXT);
export const setWindowSize = createAction(SET_WINDOW_SIZE);

export default reducer;
