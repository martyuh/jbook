import './action-bar.css'
//custom hook
import {useActions} from '../hooks/use-actions'

interface ActionBarProps {
    //just need the id don't need to import the entire cell
    id: string;
}

//type annotate the interaface ActionBarProps
const ActionBar:React.FC<ActionBarProps> = ({id}) => {
// movecell, and deletecell actioncreators from the custom hook useActions
const {moveCell, deleteCell} = useActions()
    return(
        <div className='action-bar'>
            <button className='button is-primary is-small' onClick = {()=>moveCell(id,'up')}>
                <span className="icon">
                    <i className="fas fa-arrow-up"></i>
                </span>
            </button>
            <button className='button is-primary is-small' onClick={()=>moveCell(id,'down')}>
            <span className="icon">
                    <i className="fas fa-arrow-down"></i>
                </span>
            </button>
            <button className='button is-primary is-small' onClick={()=>deleteCell(id)}>
            <span className="icon">
                    <i className="fas fa-times"></i>
                </span>
            </button>
        </div>
    )
}

export default ActionBar