import './cell-list-item.css'
import {Cell} from '../state'
import CodeCell from './code-cell'
import TextEditor from './text-editor'
import ActionBar from './action-bar'

//interface for props this component will receive
interface CellListItemProps{
    cell:Cell
}

const CellListItem: React.FC<CellListItemProps> = ({cell}) => {

    //determine if cell is code cell or text cell
    let child: JSX.Element;
    // provide cell object as a prop that the codecell is supposed to be displaying
    if(cell.type==='code') child = <CodeCell cell={cell}/>
    // texteditor can update the cell object when it is passed as a prop
    else child = <TextEditor cell={cell}/>
    

    return <div className='cell-list-item'>
        {/* child is text cell or code cell */}
        {child}
        {/* display the up and down arror as well as the delete button in this component */}
        {/* display action bar after child so that it renders the icons on top of child rather than using z index in css */}
        <ActionBar id={cell.id}/>
        </div>
   }
   
   export default CellListItem;