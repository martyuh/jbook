//custom hook from useSelector allows for access to type of data/state stored in the store. hook version of mapstatetoprops 
import { useTypedSelector } from "../hooks/use-type-selector";

const CellList: React.FC = () => {
    // mousing over state will reveal the type of data stored in the redux store 
    // destructure cells from the state combinedreducers which is assigned cellreducer to cells and therefore is the state, and further destructure order array and data object from cells
    useTypedSelector(({cells}) => {})
 return <div>Cell List</div>
}

export default CellList;