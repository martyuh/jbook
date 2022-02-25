// component will be rendered in cell-list component
import './add-cell.css'
// custom hook to dispatch actions
import {useActions} from '../hooks/use-actions'

//interface to type the props
interface AddCellProps{
//id of the cell following the one that you're adding
nextCellId:string|null;
//determine whether to show add buttons at the top of the page if all the cells are deleted
// ? makes the prop optional and has it so that the prop doesn't need to be included
//the prop will be sent from cell-list if the cell length is zero
//if it is sent then forcevisible will be displayed
forceVisible?: boolean;

}

//type annotation of component is React.fc<addcellprops>
const AddCell: React.FC<AddCellProps> = ({forceVisible,nextCellId}) => {

    // pull out insercellbefore actioncreator out of the custom useaction hook
    const {insertCellBefore} = useActions()
    //the prop will be sent from cell-list if the cell length is zero
//if it is sent then forcevisible will be displayed
    return <div className={`add-cell ${forceVisible && 'force-visible'}`}>
        {/* for css styling */}
        {/* string interpolation to determine if the forcevisible should be displayed */}
        <div className="add-buttons">
        {/* click will call action creator insertCellBefore first argument will be the nextcellid prop and second will be the type of cell */}
        <button className='button is-rounded is-primary is-small' onClick={()=>insertCellBefore(nextCellId,'code')}>
            <span className='icon is-small'>
            <i className="fas fa-plus"/>
            </span>
            <span>Code</span> 
        </button>
        <button className='button is-rounded is-primary is-small' onClick={()=>insertCellBefore(nextCellId,'text')}>
        <span className='icon is-small'>
        <i className="fas fa-plus"/>
        </span>   
          <span>Text</span>  
        </button>
        </div>
        {/* line behind the buttons */}
        <div className="divider"></div>
    </div>
}

export default AddCell; 