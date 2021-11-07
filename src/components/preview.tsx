import {useRef, useEffect} from 'react'
//interface to define all the props that Preview is passed
interface PreviewProps {
    code:string
}

// how to get html code into iframe
    //the script element will be passed to the iframe where the html will intepret the javascript code that is passed in from the bundler.
    //code for event listener to listen for input into parent html
    //there will be skeleton of an html document
    //eval evaluates js code represented as a string
    //the results of the input is then displayed. console.log(1) will display as 1 in the console log. 
    //use try and catch block to display an error if it occurs 
    //eval will work when correct code is entered it can be used to evaluate the input and displayed in the iframe
    //if there is an error eval will not work and the catch portion will circumvent any attempt at eval by displaying a message via a queryselector to the root id.
    const html =`
        <html>
        <head></head>
        <body>
        <div id="root"></div>
        <script>
        window.addEventListener('message',(event)=>{
            try{
            eval(event.data);
            } catch(err) {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color:red;"><h4>Runtime Error:</h4>' + err + '</div>'
            console.error(err)
            }
        },false)
        </script>
        </body>
        </html>

    `


//annotate the type of the preview component with React.FC<PreviewProps> so that it can receive the props and the type outlined in the interface
 const Preview: React.FC<PreviewProps> = ({code}) => {
    //ref to the iframe to bypass having to update a code piece of state
    //used to emit a message into the iframe
    // assign it to the iframe element
    const iframe=useRef<any>()

    useEffect(()=>{
    //resets the iframe. done so to prevent previous code from persisting 
    iframe.current.srcdoc = html;
    //the bundling is complete we take the reference to the iframe and emit a message down into the iframe by using postmessage
    //iframe.current refers to the iframe element via the reference
    //post a message to it from the code that is transpiled by accessing the code that is passed in
    //text is what contains the transpiled and bundled code which will contain whatever input is entered by the user
    iframe.current.contentWindow.postMessage(code,'*')
    //the dependency is whenever new code is entered
    },[code])
    // {/* embed an html document inside of another with iframe */}
    // {/* sandbox property with empty string prevents communication between parent and child. 'allow-same-origin' with the sandbox allows communications */}
    // {/* take html variable below and assign it to the srcDoc property to store the html code as the property.*/}
    // {/* all that is in the iframe is the script element that is passed in. iframe will find the script tag and execute the code within it*/} 
    //{/* sandbox with an empty string prohibits running js through scripts, alerts, devices */}
    return <iframe 
    title='preview'
    ref={iframe} 
    sandbox='allow-scripts' 
    srcDoc={html} />
 }

 export default Preview;