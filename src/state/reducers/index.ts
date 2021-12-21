import { combineReducers } from 'redux';
import cellsReducer from './cellsReducer';

// combine the reducers and assign a key
const reducers = combineReducers({
    // produces a piece of state that will be called cells
    cells: cellsReducer
})

export default reducers

// type the useSelector hook
//defines the structure of the state object which is reducers in the redux store
export type RootState = ReturnType<typeof reducers>