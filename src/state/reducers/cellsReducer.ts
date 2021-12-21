//immer is a library that allows simple modification of state in the reducer. behind the scenes immer allows you to not have to return a new object. 
import produce from 'immer'
import { ActionType } from "../action-types";
import { Action } from "../actions";
import {Cell} from '../cell'

//define interface of the exact structure of the reducer
interface CellsState {
    loading:boolean;
    error: string | null;
    // array of strings for the id of each cell
    order:string[]
    // keys are the ids of the individual cells and the values are the cells themselves
    //stored in an object so that they can be access more efficiently later
    data:{
        //key is type string
        //cell type interface is imported
        [key:string]: Cell,
    }
}
// define intial state annotated with CellsState*
const initialState = {
    loading: false,
    // no error so starts as null
    error: null,
    //empty array because there are no cells
    //order with which the cells will be presented on the screen
    order: [],
    // data will be object with cell ids and value will be a cell object  for each cell id. the data object might have several of these cells
    //also empty object because there are no cells
    data:{}
}
//define reducer
//state type is CellsState and it's defaulted to initialstate
// action can be annotated by any of the different types that are imported in from Action
// annotate the function by indicating that it will return a value taht satisfies the interface cellsState, returning an object that has the correct structure. with immer libary there will be no return object so the annotation can be removed
// when working with redux you return new object rather than a modified one
//produce in the immer library allows simple modification of state in the reducer. behind the scenes immer allows you to not have to return a new object as it does it for you, which means you don't have to return anything, you just have to update the state in the reducer
const reducer = produce((state:CellsState = initialState, action:Action) => {
    switch(action.type){
        // update an existing cell
        case ActionType.UPDATE_CELL:
            //destructure id and content
            const {id,content} = action.payload;
            //using immer return object is not required as immer will update and return the object for you.
            //exisiting content via the id in data within state is updated with the content from payload
            state.data[id].content = content
            // return after state object via immer prevents fall through to other cases
            //immer doesn't require state to be returned but ts needs it to prevent an error
            return state;
            //return an object with all the existing properties of state
            // return {
            //     ...state, 
            // // data will be object with cell ids and value will be a cell object  for each cell id. the data object might have several of these cells
            // // redefine data property 
            // //insert all existing cells from the data property
            // //access cell id and insert existing cell properties
            // //overwrite cell content within those properties wit action.payload.content
            // data:{
            //     ...state.data,
            //     [id]:{
            //         ...state.data[id],
            //         //es6 allows for content:content to be written as just content
            //         content
            //     }
            // }

            // };
        case ActionType.DELETE_CELL:
            //immer allows you to not have to return an object
            //you can modify the state directly by deleting from the state
            //must remove id from the data property in state
            delete state.data[action.payload]
            //filter out id from order property in state and assign it to state.order
            state.order = state.order.filter(id => id !== action.payload)
            //return prevents fallthrough to other cases
            return state;
        case ActionType.MOVE_CELL:
            // destructure direction off of action.payload
            const {direction} = action.payload;
            //find the index of the cell that you want to move by passing the payload.id into the callback function in the findindex method
            const index = state.order.findIndex((id) =>id === action.payload.id);
            //determine new index of element based on up index-1 to a smaller index and therefore higher up or down index+1 to a higher index which will be further down, and assign to targetIndex
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            //conditional to determine whether the targetindex is within the bounds of the order array. if so return early because it will be an invalid state update
            if(targetIndex < 0 || targetIndex > state.order.length -1) return state;
            //swap the ids in the index of order
            //assign targetindex to index
            state.order[index] = state.order[targetIndex];
            //because index will have targetindex already assigned to it assign the payload id to targetindex
            state.order[targetIndex] = action.payload.id;
            return state;
        case ActionType.INSERT_CELL_BEFORE:
            // action.payload.id will contain the id of the cell that you want the new cell generated to go before

            // create a new cell and annotate type as Cell which is imported
            // insert into data object and order array
            const cell: Cell = {
                content:'',
                type:action.payload.type,
                // custom function below
                id: randomId()
            }
            //update data object by assigning the new cell generated to the cell id that was generated
            state.data[cell.id] = cell
            //find the index where the action.payload.id matches that within the order array and assign it to index
            const foundIndex = state.order.findIndex(id=>id===action.payload.id) 
            // if it's not in order array, add new cell to the end of the order array
            if(foundIndex < 0) state.order.push(cell.id)
            // else use splice to enter it before the foundIndex with cell.id
            else state.order.splice(foundIndex,0,cell.id)
            return state;
        default:
            return state;
    }
})

const randomId  = () => {
    // random using 0-9anda-z and taking just a slice from the index 2to 5.
    return Math.random().toString(36).substr(2, 5);
}

export default reducer;