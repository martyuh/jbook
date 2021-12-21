//this css file will address the bulma css conflicts that arise when you enter in code that will cause the editor to assign a class name that is identical to a bulma one.
import './text-editor.css'
import {useState,useEffect,useRef} from 'react'
// installed markdown editor
import MDEditor from "@uiw/react-md-editor";


const TextEditor: React.FC = () =>{
    //to prevent eventbubbling a ref is  assigned to the div element to determine whether the target clicked is within the div element. if so editing remains true
    //annotate with htmldivelement or null
    const ref = useRef<HTMLDivElement|null>(null)
// state to determine whether the edit mode component is showing false would set it to not displaying
    const[editing,setEditing]=useState(false)
    //to keep track of what is typed into the editor to display in the preview window
    const [value,setValue] = useState('# Header')
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
            <MDEditor value={value} onChange={(v)=>setValue(v||'')}/>
        </div>);}

    return (
    // if markdown is clicked editing state will be toggled to true
    <div className='text-editor card' onClick={()=>setEditing(true)}>
        <div className="card-content">
        {/* preview of the markdown, value is state with what is being typed into the text editor  */}
        <MDEditor.Markdown source={value}/>
        </div>
        </div>) 
}

export default TextEditor;