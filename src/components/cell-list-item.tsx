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
    //to show action bar on top of the code cell add react fragment 
    //if it is a code cell you can show the actionbar above the codecell
    if(cell.type==='code') child = <>
    <div className="action-bar-wrapper">
        {/* display the up and down arror as well as the delete button in this component */}
        <ActionBar id={cell.id}/>
    </div>
    <CodeCell cell={cell}/>
    </>
    // texteditor can update the cell object when it is passed as a prop
    //show actionbar
    else child = <>
    <TextEditor cell={cell}/>
    {/* display the up and down arror as well as the delete button in this component */}
    {/* actonbar goes under texteditor to bypass z index issues */}
    <ActionBar id={cell.id}/>
    </>

    return <div className='cell-list-item'>
        {/* child is text cell or code cell */}
        {child}

        </div>
   }
   
   export default CellListItem;