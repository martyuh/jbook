import './code-editor.css'
import { useRef } from 'react';
//editorDidMount is a type defition file used to annotate onEditorDidMount
import MonacoEditor,{EditorDidMount} from '@monaco-editor/react'
//import prettier for formatting
import prettier from 'prettier';
//parser for js from prettier
import parser from 'prettier/parser-babel'

import React from 'react'
import { editor } from 'monaco-editor';

interface CodeEditorProps{
    initialValue: string;
    //onchange function will take in a value that is type string and it will not return anything
    onChange(value:string):void;
}

//must install monaco editor. customize using the props
//typescript by annotating to define the type for the functional component that tells the code editor that it will receive an interface that will detail the type of prop that codeEditor will receive
//when a user types in the editor we call onchange
const CodeEditor:React.FC<CodeEditorProps> = ({onChange,initialValue}) => {
    //get access to monacoEditor variable using useref
    //you can use ref to reference an arbitrary value inside a component and hold a reference to it
    //create a reference variable so that it can
    const editorRef = useRef<any>();

    //this function is only called when the editor is first displayed on the screen 
    //first parameter is the getvalue function. it gets the current value out of the editor
    //in order to call getvalue you need the second argument to recognize changes to the editor by the user
    //second argument is a reference to the editor itself with a return type of any 
    //type annotate with the editordidmount file that is imported in so that you don't have to type annotate the individual arguments. this is because the file contains all the type annotation that is required for the arguments
    const onEditorDidMount:EditorDidMount = (getValue, monacoEditor) => {
        //update the value of editorRef with monacoEditor so that it can reference monacoEditor
        editorRef.current = monacoEditor
        // add in an eventListener to the monacoEditor itself to listen for when the contents of the editor changes
        //monacoEditor is recognized as an instance ofa  standalone editor
        monacoEditor.onDidChangeModelContent(()=>{
            //onchange updates the piece of state when you pass in getValue, this is passed in from index.tsx as onchange function is passed in as a prop
            //which allows for the bundling of the code
            onChange(getValue())
        })
        //reduces tab to two spaces
        monacoEditor.getModel()?.updateOptions({tabSize:2})

    }

    const onFormatClick = () =>{
        // get current text value inside the editor
        const unformatted = editorRef.current.getModel().getValue();
        //format value with prettier. the object instructs how to format the text
        //a string is created and passed to formatted
        const formatted = prettier.format(unformatted,{
            // treat as js
            parser:'babel',
            //parser used
            plugins:[parser],
            //don't want tabs
            useTabs:false,
            //want to add semi colons
            semi: true,
            //use single quotes if possible
            singleQuote: true,

            //remove the new line that prettier adds in when you format 
            //use regex \n$ looks for a new line character at the end of the string
        }).replace(/\n$/,'')
        //editorref.current is referencing the monaco editor to set formatted value back in editor
        editorRef.current.setValue(formatted)

    }

    return (
    // button to run prettier on code for proper formatting
    //use bulma styles
    <div className='editor-wrapper'>
        <button className='button button-format is-primary is-small' onClick={onFormatClick}>Format</button>
    <MonacoEditor
    //to get value out of text editor or any change to it, provide a call back oneditordidmount
    editorDidMount = {onEditorDidMount}
    // initial value
    value = {initialValue}
    language='javascript' 
    height='500px'
    // must use vs-dark instead of dark
    theme='vs-dark'
    options={{
        wordWrap:'on',
        minimap: {enabled:false},
        // anything that is unused will not be faded out
        showUnused: false,
        //get rid of margin on the rgith of the numbers:
        folding: false,
        //left of the numbers
        lineNumbersMinChars: 3,
        fontSize: 16,
        scrollBeyondLastLine: false,
        //formats itself when window is resized
        automaticLayout: true,
    }}
    />
    </div>
    
    )
}

export default CodeEditor
