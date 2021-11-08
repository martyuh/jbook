//codeCell provides a component to render one code editor and one preview window

import { useState} from 'react';
import CodeEditor from './code-editor';
import Preview from './preview'
//bundle is function that will create a bundle from the user code that is passed to it.
import bundle from '../bundler'

//bundlers are used for browsers that don't utilize module systems which are imported/exported 
const CodeCell = () => {
    const [input, setInput] = useState('');
    // code that is transpiled
    const [code, setCode] = useState('');

    //transform is async in nature so the onclick function needs to be setup as an async await function
    const onClick = async () => {
        //when the user clicks an async request is sent to index.ts where it will pass the user input and return a the bundled input and assign it to output
        const output = await bundle(input)
        // in case user clicks button before the esbuild service is ready use conditional to prevent error. check to see if esbuild service is active before any transpiling is started
        // if there is no ref.current, if it is null then just return early



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

        // setting the state for the code that is transpiled by accessing the first object's text property in outputFiles
        //text is what contains the transpiled and bundled code
        //not necessary anymore when referencing the iframe
        //output is passed into setcode to update the state
        setCode(output);
        
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
    
    return <div>
        <CodeEditor 
        //onchange callback will have the new value just typed in that will update the setinput state
        onChange={value=>setInput(value)}
        initialValue='const a = 1'/>
        <div>
            <button onClick={onClick}>Submit</button>
        </div>
        {/* pre makes the code look like code */}
        {/* <pre>{code}</pre> */}

        {/* need to communicate bundled code into Preview component from when the entire bundling process is completed and assigned to result, a piece of state needs to be updated, this will cause the component to rerender and pass into Preview which is then processed in the Preview component*/}
    
        <Preview code={code}/>
    </div >
}



export default CodeCell