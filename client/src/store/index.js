import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducers';
import wsmiddleware from './wsmiddleware';

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk, wsmiddleware))
);

export default store;
