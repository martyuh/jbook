import {useRef, useEffect} from 'react'
import './preview.css'
//interface to define all the props that Preview is passed
interface PreviewProps {
    code:string;
    err: string; 
}

// how to get html code into iframe
    //the script element will be passed to the iframe where the html will intepret the javascript code that is passed in from the bundler.
    //code for event listener to listen for input into parent html
    //there will be skeleton of an html document
    //eval evaluates js code represented as a string
    //the results of the input is then displayed. console.log(1) will display as 1 in the console log. 
    //use try and catch block to display a synchronous error if it occurs 
    //eval will work when correct code is entered it can be used to evaluate the input and displayed in the iframe
    //if there is an error eval will not work and the catch portion will circumvent any attempt at eval by running handleError function, displaying a message via a queryselector to the root id.
    //catch any error such as asynchronous ones, create an eventlistener that will listen for an error, it will have a callback function that will receive an event object, the event will contain an error property which will be passed to the handleErorr function that is called via the eventlistener
    //to stop uncaught error from being displayed in the console use event.preventDefault(). we do not need it because we are printing it in the handleError function
    
    const html =`
        <html>
        <head>
        <style>html {background-color:white;}</style>
        </head>
        <body>
        <div id="root"></div>
        <script>
        const handleError = (err) => {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color:red;"><h4>Runtime Error:</h4>' + err + '</div>'
            console.error(err)
        }
        window.addEventListener('error',(event)=>{
            event.preventDefault();
            handleError(event.error);
        })
        window.addEventListener('message',(event)=>{
            try{
            eval(event.data);
            } catch(err) {
                handleError(err)
            }
        },false)
        </script>
        </body>
        </html>

    `


//annotate the type of the preview component with React.FC<PreviewProps> so that it can receive the props and the type outlined in the interface
 const Preview: React.FC<PreviewProps> = ({code, err}) => {
    //ref to the iframe to bypass having to update a code piece of state
    //used to emit a message into the iframe
    // assign it to the iframe element
    const iframe=useRef<any>()

    useEffect(()=>{
    //resets the iframe. done so to prevent previous code from persisting 
    //creates an eventlistener within the iframe
    iframe.current.srcdoc = html;
    //the bundling is complete we take the reference to the iframe and emit a message down into the iframe by using postmessage
    //iframe.current refers to the iframe element via the reference
    //post a message to it from the code that is transpiled by accessing the code that is passed in
    //text is what contains the transpiled and bundled code which will contain whatever input is entered by the user
    //settimeout so that postmessage is not listening with previous eventlistener(srcdoc being assigned html takes just a little bit longer to load than the message that is instantly posted via post message). the srcdoc will have time to load in the html/evenlistener and be able to listen for the postmessage/current code that is being sent in and bundled.
    setTimeout(()=>{
    iframe.current.contentWindow.postMessage(code,'*')
    },50)
    
    //the dependency is whenever new code is entered
    },[code])
    // {/* embed an html document inside of another with iframe */}
    // {/* sandbox property with empty string prevents communication between parent and child. 'allow-same-origin' with the sandbox allows communications */}
    // {/* take html variable below and assign it to the srcDoc property to store the html code as the property.*/}
    // {/* all that is in the iframe is the script element that is passed in. iframe will find the script tag and execute the code within it*/} 
    //{/* sandbox with an empty string prohibits running js through scripts, alerts, devices */}
    //preview-wrapper is a style element to ensure that the resizing of the code-cell continues to resize if you roll the mouse over the preview cell side.
    return (<div className='preview-wrapper'>
        <iframe
    
    title='preview'
    ref={iframe} 
    sandbox='allow-scripts' 
    srcDoc={html} />
    {/* truthy error for if its a bundling error*/}
    {/* the reason why it demostrates word wrap is because it is absolute to the preview-wrapper, and the preview wrapper is relative */}
    {err && <div className='preview-error'>{err}</div>}
    </div>)
 }

 export default Preview;