import {ActionType} from '../action-types';
//you cannot access the action interfaces through Action import, rather you have to export and import each interface separately
import { 
    UpdateCellAction,
    DeleteCellAction,
    MoveCellAction,
    InsertCellAfterAction,
    Direction} 
    from '../actions';
import { CellTypes } from '../cell';

// annotation of type must return object that satisfies the interface
export const updateCell = (id:string,content:string):UpdateCellAction => {
    // return object that satisfies the updatecellation interface
    return{
        type: ActionType.UPDATE_CELL,
        payload:{
            id:id,
            content:content
        }
    }

}

export const deleteCell = (id:string):DeleteCellAction => {
    return{
        //payload will be a string
        type:ActionType.DELETE_CELL,
        payload:id
    }
}

export const moveCell = (id:string, direction:Direction):MoveCellAction => {
    return{
        type:ActionType.MOVE_CELL,
        payload:{
            id,
            direction
        }
    }
}
// parameters of id and celltype will be passed to id and type and returned as an action
export const insertCellAfter = (id:string|null, cellType:CellTypes):InsertCellAfterAction => {
    return{
        type:ActionType.INSERT_CELL_AFTER,
        payload:{
            id,
            // celltypes of code or text will be returned with the payload
            type:cellType
        }
    }

}