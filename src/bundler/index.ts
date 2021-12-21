//wrap all the logic around esbuild in this file
import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugins';
import { fetchPlugin } from './plugins/fetch-plugin';

//variable is service with the type attribute of esbuild.Service
let service: esbuild.Service;

//export a function that takes code in as a string in that was entered into the code editor
//async function because it is waiting for a response from esbuild      
const bundle =  async (rawCode:string) => {
        // initialize esbuild service, giving it the opportunity to fetch the webassembly bundle that is placed in the public directory.
        //get back a service object
        //use the transform and build functions athat are returned
        //transform will transpile the code that you provide
        //to bundle your code you have to use build
        //esbuild only needs to be initialized one time
        //calling startservice returns a bundler for the users code, therefore you do not need to call startsevice every time someone calls this function
        //can take the result of what is returned and assign it to a variable above the function
        // conditional to determine if service is assigned which means the function has been called before. If it hasn't assign the esbuild.startservice bundler to service
        if(!service){
            service = await esbuild.startService({
                worker: true,
                // rather than hosting the esbuild web assembly binary locally, access unpkg.com to grab it
                wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
            })
        }
        
        //use build instead of transform
        //when build is called we get a result object in return, assign it to the result variable
        //you can then return the result object by accessing the outputfiles property, and inside that array the first element has a text property and that is the output of the bundling and transpiling
        //error handling from invalid code that causes a bundling error that is not async or sync it is handled here
        try{
        const result = await service.build({
            // index.js, this file, will be be bundled in the application with the imported modules that will be processed by onresolve and onload in the plugin that will help bypass esbuild's attempt to access a default file tree, the plugin will instead grab the proper package by grabbing the proper path via a template literal via an axios call.
            //esbuild then starts the bundling process in the browser
            //it then proceeds to the onresolve step to figure out where the index.js file is stored
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            // rawcode that user provided
            // custom plugin to resolve and load paths and files
            plugins: [unpkgPathPlugin(),fetchPlugin(rawCode)],
            //gets rid of warnings
            define:{
                //this means whenever you find proces.env.node_env inside the code you replace it with the string 'production'
                // must put in outer quotes or the variable production will replace process.env instead of the string production
                'process.env.NODE_ENV': '"production"',
                //if you find the variable global within the code you replace it with the window variable
                global:'window'
            }
        });
        //to be able to decipher whether or not a bundled code is returned which is a string from an error which is also a string, return an object that will help determine whether the string returned is an error or the bundled code
        return {
            code:result.outputFiles[0].text,
            err: ''
        }
    }catch(err:any){
        return {
            code:'',
            err: err.message,
        }
    }

}

export default bundle 