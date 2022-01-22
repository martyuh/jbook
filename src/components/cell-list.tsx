//custom hook from useSelector allows for access to type of data/state stored in the store. hook version of mapstatetoprops 
import { useTypedSelector } from "../hooks/use-type-selector";
import CellListItem from "./cell-list-item";

const CellList: React.FC = () => {
    // mousing over state will reveal the type of data stored in the redux store 
    // destructure cells from the state combinedreducers which is assigned cellreducer to cells and therefore is the state, and further destructure order array and data object from cells
    //return order.map
    //receive an id and look for the appropriate cell out of the data object return that cell and return it from the map function
    //which will result in a list of cells in the correct order from the data object
    const cells = useTypedSelector(({cells:{order,data} }) => order.map((id)=> data[id]) )

    //map over the cells list and provide each mapped over cell to the cell-list-item component
    const renderedCells = cells.map(cell =><CellListItem key={cell.id} cell={cell}/>)

    return <div>{renderedCells}</div>
}

export default CellList;