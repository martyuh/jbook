//custom hook from useSelector allows for access to type of data/state stored in the store. hook version of mapstatetoprops 
import { useTypedSelector } from "../hooks/use-type-selector";
import CellListItem from "./cell-list-item";
import AddCell from "./add-cell";
import { Fragment } from "react";

const CellList: React.FC = () => {
    // mousing over state will reveal the type of data stored in the redux store 
    // destructure cells from the state combinedreducers which is assigned cellreducer to cells and therefore is the state, and further destructure order array and data object from cells
    //return order.map
    //receive an id and look for the appropriate cell out of the data object return that cell and return it from the map function
    //which will result in a list of cells in the correct order from the data object
    const cells = useTypedSelector(({cells:{order,data} }) => order.map((id)=> data[id]) )

    //map over the cells list and provide each mapped over cell to the cell-list-item component
    const renderedCells = cells.map((cell) =>(
    // addcell buttons will be rendered when list of the cells is mapped over and rendered
    <Fragment key={cell.id}>
    {/* id of the next cell is the id of the current cell being mapped over */}
    <AddCell nextCellId={cell.id}/>
    <CellListItem key={cell.id} cell={cell}/>
    </Fragment>
    ))
    
    return <div>
        {renderedCells}
        {/* addcell is at the end to account for the last series of buttons at the end, being that there is no cell after the buttons the nextcellid will be null */}
        {/* style it so that if all the cells are deleted the add buttons are still visible */}
        <AddCell forceVisible={cells.length===0} nextCellId={null}/>   
        </div>
}

export default CellList;