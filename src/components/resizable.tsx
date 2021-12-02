//ResizableBoxProps type to annotate resizableProps
import { ResizableBox,ResizableBoxProps } from "react-resizable";
import { useEffect, useState } from "react";
import './resizable.css'

interface ResizableProps {
    //must provide a prop direction that is the exact string 'horizontal' or 'vertical'
    direction: 'horizontal' | 'vertical';
}
//this will be used by code-cell to allow for resizing for multiple code and preview window cells
//this component allows you to resize the editor-cell 
//type definition using an interface
//receive the direction prop
//children prop is received when you try to render resizable with some other react component or text content inside of it
//children is what you want to make resizable
const Resizable:React.FC<ResizableProps> = ({direction,children}) => {

    //resizableProps to assign to props for resizable box depending on which direction the window is being resized
    //resiaableProps annotated with imported ResizableBoxProps type
    let resizableProps:ResizableBoxProps;
    //declare innerheight which is updated when the window is resized
    const[innerHeight,setInnerHeight] = useState(window.innerHeight)
    //declare innerWidth
    const[innerWidth,setInnerWidth] = useState(window.innerWidth)
    //width state to track change to panel window resize
    //when resizablebox is changed the width in data will be used to setWidth
    const [width,setWidth] = useState(window.innerWidth*0.75)

    //useeffect will run once to  listen for browser window resizing
    
    useEffect(()=>{
    // create a debounce to prevent repeated update to innerheight and inner width
        let timer:any;
        const listener =()=>{
            //clears it again if it is set, meaning everytime the window is resized the timer is reset and setInnerHeight and innerWidth will not run.
            if(timer){
                clearTimeout(timer)
            }
            //this runs every time but will only complete if the timer is not reset by a follow up resize of the window
            //only runs after 100milliseconds and is set only after that, meaning the window resizes after the time expires
            timer = setTimeout(()=>{
            // update pieces of state when eventlistener detects window resize
            setInnerHeight(window.innerHeight);
            setInnerWidth(window.innerWidth);
            //because width prop in resizableBox takes precedent over the constraints this is a workaround
            //if window.innerwidth*.75 is smaller that means that width is too large
            if(window.innerWidth*0.75<width){
                setWidth(window.innerWidth*0.75)
            }
            })

        }
    // global event listener listens for resize
    window.addEventListener('resize',listener)

    //when the component is not displayed, clean up by removing eventlistener that is done so by running a function
    //it runs automatically when the component is no longer being rendered
    return ()=>{
        window.removeEventListener('resize',listener)
    }
    },[])

    if(direction ==='horizontal'){
        resizableProps={
            //className to select css to resize correctly
            className: 'resize-horizonal',
            //to prevent collapsing it horizontally
            //state value for innerWidth needs to be calculated when the browser window is resized
            minConstraints:[innerWidth*0.2,Infinity],
            //restrict how far a user can resize the cell horizontal and vertical
            maxConstraints:[innerWidth*0.75,Infinity],            
            height:Infinity,
            //after the width is updated from the resize, the state will update with a new width that is set and that will then be applied to  the width prop in resizableBox and will adjust properly when the browser window is resized.
            width:width,
           //  documentation requires that it be set in an array
           // styling must be done to render the desired resizing handle on the eastern edge
            resizeHandles:['e'],
            // detects when change to resizable box
            //detects when the resize of the panel stops
            //callback to set the width state is resizable when width in onResizeStop is used to setWidth
            onResizeStop:(event,data)=>{
                setWidth(data.size.width)
            }
        }
    }
    // vertical case
    else{
        resizableProps={
            width:Infinity,
            height:300,
            //to prevent collapsing it vertically
            minConstraints:[Infinity,24],
            //restrict how far a user can resize the cell horizontal and vertical
            //state value for innerheight
            maxConstraints:[Infinity,innerHeight*0.9],
           //  documentation requires that it be set in an array
           // styling must be done to render the desired resizing handle on the south edge
            resizeHandles:['s'],
        }
    }

    

 return (
    // Resizable box allows the component to provide the resizing features
    // must provide width and height
    //pass in resizable props via spread operator
    //props are passed to the children
 <ResizableBox {...resizableProps}
 >
     {children}
</ResizableBox>)
}

export default Resizable