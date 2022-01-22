//codeCell provides a component to render one code editor and one preview window
import { useState,useEffect} from 'react';
import CodeEditor from './code-editor';
import Preview from './preview'
//bundle is function that will create a bundle from the user code that is passed to it.
import bundle from '../bundler'
import Resizable from './resizable'
// interface
import {Cell} from '../state'
// custom hook to dispatch actions
import {useActions} from '../hooks/use-actions'


//interface for the props that this component will receive from celllistitems
interface CodeCellProps{
    // cell object of type Cell, with the Cell interface defined in cell.ts
    cell:Cell
}
//type annotation codeCellprops
//bundlers are used for browsers that don't utilize module systems which are imported/exported 
const CodeCell:React.FC<CodeCellProps> = ({cell}) => {
    // code that is transpiled
    const [code, setCode] = useState('');
    //returned from index in bundler directory
    const [err, setErr] = useState('')
    // updateCells is from actionCreators from useActions
    // use updatecell to update the input piece of state that user types in
    const {updateCell} = useActions();

    
    //create a debounce scenario. settimeout starts when first input is created but is reset everytime there is an input quicker than one second. if no input for one second or longer settimeout timer expires and callback function is run
    useEffect(()=>{
        // callback function will be set to async do to asyncronous call to bundle
        const timer = setTimeout(async()=>{
        //when the user clicks an async request is sent to index.ts where it will pass the user input via cell.content and return a the bundled input and assign it to output
        const output = await bundle(cell.content)

        // setting the state for the code that is transpiled by accessing the first object's text property in outputFiles
        //text is what contains the transpiled and bundled code
        //not necessary anymore when referencing the iframe
        //object for code is returned. output.code is passed into setcode to update the state
        //preview component will conditionally decide to show code or error
        setCode(output.code);
        //output.err and passed into setErr to update error state
        setErr(output.err);
        
  
        },1000)

        //clear timer if input is entered before one second
        //that can be done by returning a function in useEffect. When a function is returned, that returned function will run next time useEffect is run. In this case useEffect runs when the next input is made, and because the return function clears the timer, the time gets reset, but is subsequently started again inside useEffect. if no more input is made the timer will expire and the async call to bundle will be made.
        return ()=>{
            clearTimeout(timer)
        }
    //useEffect runs only when cell.content changes
    },[cell.content])


    return (
        // make it resizable in the vertical direction with the direction prop
    <Resizable direction='vertical'>
    <div style={{height:'100%',display:'flex',flexDirection:'row'}}>
        {/* separate resizable component to allow for resizing in horizontal direction */}
        <Resizable direction='horizontal'>
        <CodeEditor 
        //onchange callback will have the new value just typed in that will update the piece of state using updateCell
        onChange={value=>updateCell(cell.id,value)}
        initialValue={cell.content}/>
        </Resizable>
        {/* pre makes the code look like code */}
        {/* <pre>{code}</pre> */}
        {/* need to communicate bundled code into Preview component from when the entire bundling process is completed and assigned to result, a piece of state needs to be updated, this will cause the component to rerender and pass into Preview which is then processed in the Preview component*/}
        {/* pass code and err as props to the component */}
        <Preview code={code} err={err}/>
    </div >
    </Resizable>
    )
}



export default CodeCell