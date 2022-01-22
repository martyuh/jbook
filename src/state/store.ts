import { createStore, applyMiddleware} from "redux";
import thunk from 'redux-thunk'
import reducers from "./reducers";

//pass in reducers, empty object for initial state and, apply middleware thunk for async action call
export const store  = createStore(reducers,{},applyMiddleware(thunk));

// //if you want to grab all the state from the store
// const state =  store.getState() 

