import { createStore, compose, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import reducer from './reducers';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

export default createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
