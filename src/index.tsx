import * as esbuild from 'esbuild-wasm'
import ReactDOM from "react-dom";
// useRef hook to keep value of service within startService
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugins';
import { fetchPlugin } from './plugins/fetch-plugin';

//bundlers are used for browsers that don't utilize module systems which are imported/exported

const App = () => {
    // ref.current can refer to any type of variable within the 
    const ref = useRef<any>()
    const [input, setInput] = useState('');
    // code that is transpiled
    const [code, setCode] = useState('');
    //ref to the iframe to bypass having to update a code piece of state
    //used to emit a message into the iframe
    // assign it to the iframe element
    const iframe=useRef<any>()



    //utilize esbuild
    // call the startService with useEffect
    const startService = async () => {
        // initialize esbuild service, giving it the opportunity to fetch the webassembly bundle that is placed in the public directory.
        //get back a service object
        //use the transform and build functions athat are returned
        //transform will transpile the code that you provide
        //to bundle your code you have to use build
        // use a ref to keep a value to any js value inside a component. you will do this by assigning the object returned to ref.current
        ref.current = await esbuild.startService({
            worker: true,
            // rather than hosting the esbuild web assembly binary locally, access unpkg.com to grab it
            wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
        })

    }
    // startservice should only one once
    useEffect(() => {
        startService()
    }, [])

    //transform is async in nature so the onclick function needs to be setup as an async await function
    const onClick = async () => {
        // in case user clicks button before the esbuild service is ready use conditional to prevent error. check to see if esbuild service is active before any transpiling is started
        // if there is no ref.current, if it is null then just return early
        if (!ref.current) return;

        //the transform function will only do transpiling, it will not do any bundlying or joining modules
        //input is the text that you want to transpile
        //the second argument is the options you want to use during the transpiling proces
        // transform is an async function
        // const result = await ref.current.transform(input, {
            // loader indicates the type of code that will be provided to it, js, jsx, typescript
            // loader: 'jsx',
            // used for the options that esbuild needs for transpiling process like spread, async await
        //     target: 'es2015'
        // });
        //use build instead of transform
        // first argument is an object
        const result = await ref.current.build({
            // index.js, this file, will be be bundled in the application with the imported modules that will be processed by onresolve and onload in the plugin that will help bypass esbuild's attempt to access a default file tree, the plugin will instead grab the proper package by grabbing the proper path via a template literal via an axios call.
            //esbuild then starts the bundling process in the browser
            //it then proceeds to the onresolve step to figure out where the index.js file is stored
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            // input code that user provided
            // custom plugin to resolve and load paths and files
            plugins: [unpkgPathPlugin(),fetchPlugin(input)],
            //gets rid of warnings
            define:{
                //this means whenever you find proces.env.node_env inside the code you replace it with the string 'production'
                // must put in outer quotes or the variable production will replace process.env instead of the string production
                'process.env.NODE_ENV': '"production"',
                //if you find the variable global within the code you replace it with the window variable
                global:'window'
            }
        });
        console.log(result)
        // setting the state for the code that is transpiled by accessing the first object's text property in outputFiles
        //text is what contains the transpiled and bundled code
        //not necessary anymore when referencing the iframe
        // setCode(result.outputFiles[0].text);
        
        //the bundling is complete we take the reference to the iframe and emit a message down into the iframe by using postmessage
        //iframe.current refers to the iframe element via the reference
        //post a message to it from the code that is transpiled by accessing the first object's text property in outputFiles 
        //text is what contains the transpiled and bundled code which will contain whatever input is entered by the user
        iframe.current.contentWindow.postMessage(result.outputFiles[0].text,'*')


        //execute arbitrary js contained in a string is to you eval() which means in most situations can be used to execute the js that is passed in from the bundled result
        //wrap in a try error catch to prevent erroneous code
        //don't need this when running out of an iframe
        // try{
        //     // warning, an async call will not allow this try catch block to catch an error
        //     eval(result.outputFiles[0].text)
        // }catch(err){
        //     alert(err)
        // }
    }
    // how to get html code into iframe
    //the script element will be passed to the iframe where the html will intepret the javascript code that is passed in from the bundler.
    //code for event listener to listen for input into parent html
    //there will be skeleton of an html document
    //eval evaluates js code represented as a string
    //the results of the input is then displayed. console.log(1) will display as 1 in the console log. 
    const html =`
        <html>
        <head></head>
        <body>
        <div id="root"></div>
        <script>
        window.addEventListener('message',(event)=>{
            eval(event.data);
        },false)
        </script>
        </body>
        </html>

    `

    return <div>
        <textarea onChange={e => setInput(e.target.value)} value={input}></textarea>
        <div>
            <button onClick={onClick}>Submit</button>
        </div>
        {/* pre makes the code look like code */}
        <pre>{code}</pre>
        {/* embed an html document inside of another with iframe */}
        {/* sandbox property with empty string prevents communication between parent and child. 'allow-same-origin' with the sandbox allows communications */}
        {/* take html variable below and assign it to the srcDoc property to store the html code as the property.*/}
        {/* all that is in the iframe is the script element that is passed in. iframe will find the script tag and execute the code within it*/} 
        {/* sandbox with an empty string prohibits running js through scripts, alerts, devices */}
        <iframe ref={iframe} sandbox='allow-scripts' srcDoc={html}/>
    </div >
}



ReactDOM.render(
    <App />,
    document.querySelector('#root')
)