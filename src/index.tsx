import * as esbuild from 'esbuild-wasm'
import ReactDOM from "react-dom";
// useRef hook to keep value of service within startService
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugins';

//bundlers are used for browsers that don't utilize module systems which are imported/exported

const App = () => {
    // ref.current can refer to any type of variable within the 
    const ref = useRef<any>()
    const [input, setInput] = useState('');
    // code that is transpiled
    const [code, setCode] = useState('');



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
            wasmURL: '/esbuild.wasm'
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
            // code that user provided
            plugins: [unpkgPathPlugin(input)],
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
        setCode(result.outputFiles[0].text);
    }

    return <div>
        <textarea onChange={e => setInput(e.target.value)} value={input}></textarea>
        <div>
            <button onClick={onClick}>Submit</button>
        </div>
        {/* pre makes the code look like code */}
        <pre>{code}</pre>
    </div >
}

ReactDOM.render(
    <App />,
    document.querySelector('#root')
)