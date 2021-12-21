
import {ActionType} from '../action-types';
import {CellTypes} from '../cell'

//define a new type of direction to establish the strings for direction that can be changed here and be reflected throughout the app.
export type Direction = 'up' | 'down'

export interface MoveCellAction {
    type: ActionType.MOVE_CELL;
    // moving cell up or down
    // use an object
    payload: {
        // id of the cell that is moved
        id: string;
        //up or down on the list. if up it appears earlier on the list, down it appears later
        direction: Direction;
    }
}

export interface DeleteCellAction {
    type: ActionType.DELETE_CELL;
    //id of the cell that you want to delete
    payload: string;
}

export interface InsertCellBeforeAction {
    type: ActionType.INSERT_CELL_BEFORE;
    // id and type of the cell that you want this new cell before
    payload: {
        //id of the cell that you want to create the new cell before
        //if it is null the cell will be added to the end
        id: string | null;
        // imported from cell.ts
        type: CellTypes;
    }
}

export interface UpdateCellAction {
    type: ActionType.UPDATE_CELL;
    // id of the cell that you want to update
    // and the content for it
    payload: {
        id: string;
        //code or text for the chosen cell
        content: string;

    }
}
//export type with all the actions
export type Action = 
MoveCellAction
| DeleteCellAction
| InsertCellBeforeAction
| UpdateCellAction;