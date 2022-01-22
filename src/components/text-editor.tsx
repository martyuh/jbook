//this css file will address the bulma css conflicts that arise when you enter in code that will cause the editor to assign a class name that is identical to a bulma one.
import './text-editor.css'
import {useState,useEffect,useRef} from 'react'
// installed markdown editor
import MDEditor from "@uiw/react-md-editor";
import {Cell} from '../state'
//action creator
import {useActions} from '../hooks/use-actions'

//interface to annotate the type of the props passed in
interface TextEditorProps {
    //the cell prop will have a type Cell, Cell.content contains the actual text from the user that is entered into the texteditor
    //call actioncreator to update the content property of the cell
    cell:Cell;
}

//type annotate the TextEditorProps interface 
//receive cell as a prop
const TextEditor: React.FC<TextEditorProps> = ({cell}) =>{
    //to prevent eventbubbling a ref is  assigned to the div element to determine whether the target clicked is within the div element. if so editing remains true
    //annotate with htmldivelement or null
    const ref = useRef<HTMLDivElement|null>(null)
// state to determine whether the edit mode component is showing false would set it to not displaying
    const[editing,setEditing]=useState(false)
    //to keep track of what is typed into the editor to display in the preview window
    // updateCells is from actionCreators from useActions
    // use updatecell to update the content property in cell that user types in
    const {updateCell} = useActions();

    //to detect click in body of the dom. 
    useEffect(()=>{
        // listener function that is called when the user clicks anywhere inside the document
        // annotate with mouseEvent
        const listener = (event:MouseEvent)=>{
            //conditional to prevent event bubbling when clicked inside editor
            //ref.current points indicates what the ref is pointing to. in this case it is the div that contains the mdeditor
            //must make sure that event.target is defined or that it is an element that exist
            //also determine whether the target element that is clicked is inside the div element via the ref.current
            //tell react that event.target is a node because ref.current expects a node type target
            if(ref.current && event.target && ref.current.contains(event.target as Node)){
                // console.log is just an indicator for this tutorial. it is not necessarty
                 console.log('element is inside editor')
                //  return is necessary
                 return;
            }
            console.log('element is not inside editor')
            setEditing(false)
        }
        // event listener for a click that will run listener. new syntax change to eventlistener requires third argument for capture in this case it is true
        document.addEventListener('click',listener,{capture:true})

        //if texteditor is no longer showing cleanup the function
        return()=>document.removeEventListener('click',listener,{capture:true})
    },[])
    //conditional statement where if editing is true 
    // add a ref in the div to determine whether the target click is inside the div element. if so editing remains true. 
    if(editing){
        return(
        <div className='text-editor' ref={ ref}>
            {/* if v is undefined it can be typed as an empty string */}
            {/* when user enters text onchange is called and the actioncreator fires  */}
            {/* it finds the cell via id and updates the value that the user types in or is undefined if that is the case it defaults to an empty string*/}
            <MDEditor value={cell.content} onChange={(v)=>updateCell(cell.id, v || '')}/>
        </div>);}

    return (
    // if markdown is clicked editing state will be toggled to true
    <div className='text-editor card' onClick={()=>setEditing(true)}>
        <div className="card-content">
        {/* preview of the markdown, cell.content is state with what is being typed into the text editor  */}
        {/* if cell.content is empty truthy conditional will allow it to show text 'click to edit' */}
        <MDEditor.Markdown source={cell.content || 'Click to edit'}/>
        </div>
        </div>) 
}

export default TextEditor;