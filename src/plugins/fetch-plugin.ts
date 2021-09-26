import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage'


//object that interacts with an instance of the  indexdb database inside the browser
const fileCache =localForage.createInstance({
    //pass in configuration object
    //all you need is the name for the the db that's created
    name: 'filecache'
});
// argument to accept input code from user
export const fetchPlugin = (inputCode:string)=>{
    //return the plugin object
    return{
        name: 'fetch-plugin',
        setup(build:esbuild.PluginBuild){
            //this onload is only run when the file matches the filter of index.js
            build.onLoad({filter:/(^index\.js$)/},()=>{
                return {
                    loader: 'jsx',
                    // user code that is inputed
                    contents: inputCode,
                };
            })
            //onloads do not need to return a value and therefore can be used to carry out exact same tasked that are carried out by multiple onload functioncs such as fetching the cachedresults
            //if the cachedResults have a value then it will return and the other onloads will not run
            //if it does not then it will continue on to the other onloads
        build.onLoad({filter:/.*/},async(args:any)=>{
                //determine if it is in cachedResults. if not send an async request using axios   
                //check to see if the imported file is in the cache
                //for the keys, use args.path
                //typescript does not know what type of value cachedResult is
                //getItem is a generic function so you can put in <es.onloadresult> to indicate the type of value it will return for cachedResult. when moused over you will see that it will be cachedResult or null
                const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path)
                //if it is in the db, it will be the object with loader,contents and resolvDir, return it immediately
                if(cachedResult) return cachedResult
                //if it is not, allow the request to path to run and store the response in cache
                //for the value, store the result object with the loader,contents and resolvDir
        })
            //this onload will run when the filter determines that the file ends in .css
            build.onLoad({filter:/.css$/},async(args:any)=>{


                //onload needs a conditional to indicate the path to fetch the file.
                //especially if you're trying to fetch a file other than index.js via the args.path which is where the file path is.
                //use axios async await  
                //we need to take the contents of the file that is fetched from the path and assign it to the destructured data that is returned from the axios call, create the object for esbuild that instructs  it to not access the file system and instead is passed the contents of the file,
                //in addition to pulling data you will also pull the property request
                //esbuild spits out two outputs when it processes a call for css. a js and a css file. but esbuild doesn't have a file system so the css file is not accounted for
                //you must trick esbuild to recoginize it
                const{data,request} = await axios.get(args.path);
                console.log(request)
                // esbuild is going to process whatever language within the file
                //it will determine it using the match method the file extension recognized by the general expression
                //use a ternary expression to determine if it is css if not load jsx
                // const fileType = args.path.match(/.css$/)?'css':'jsx';
                //replace the new line characters with an empty string using genexp this collapses the entire code into a single line
                //then replace the double quotes and encode/escape the double quotes
                //then replace the single quotes and escape them as well
                const escaped = data
                .replace(/\n/g,'')
                .replace(/"/g,'\\"')
                .replace(/'/g,"\\'")
                //if file type is css write out js
                const contents = 
                //pass in the css via the escape variable after the data has had the newline removed ,and the single and double quotes escaped 
                `
                const style = document.createElement('style');
                style.innerText = '${escaped}}';
                document.head.appendChild(style)
                ` 
                //assign the object to the result variable
                //result is returned as type esbuild.onloadresult 
                const result:esbuild.OnLoadResult = {
                    
                    loader: 'jsx',
                    contents,
                    //resolveDir instructs esbuild to determine the exact path to the package that is found be it src or whatever extended directory
                    //first argument instructs it to not grab the index file, second argument tells it to grab the entire url from the response sent back from the server, and .pathname is the path that is separate from the importer path, which is the file path, or url that contains the require import for this file
                    resolveDir: new URL('./',request.responseURL).pathname
                };
                    // in setItem for first argument provide a key for some sort of data you want to store in the db
                    //first argument is args.path for the key
                    //second argument you provide the value for the key
                    //stores information under the key args.path
                await fileCache.setItem(args.path,result);
                return result

            })
            //when the path to the file that is loaded to be bundled in the app is determined the onLoad step attempts to load the file
            //overrides esbuilds process of loading a file from a file system
            //it insteads returns an object with the contents of the file that you're trying to load
            //conditional checks to see if esbuild is trying to load its normal process of loading index.js from the file system return the object with the content
            //after it returns the object to esbuild, esbuild will try to load the files that are imported, in this case there are, which will then result esbuild repeating the steps of running onResolve where it will indicate where the message.js file is
            //once it returns that path, it will attempt to load the file.
            //the conditional this time around will determine that if onload is trying to load any other file than index.js else will run and return the contents of that file.
            // typescript needs this function to return a type of onloadresult for cachedresult
            //and it needs to know exactly the type returned for 'result' which is onloadresult
            //for the conditional cachedResult needs to be typed properly to reflect that
        build.onLoad({ filter: /.*/ }, async (args: any) => {
                //onload needs a conditional to indicate the path to fetch the file.
                //especially if you're trying to fetch a file other than index.js via the args.path which is where the file path is.
                //use axios async await  
                //we need to take the contents of the file that is fetched from the path and assign it to the destructured data that is returned from the axios call, create the object for esbuild that instructs  it to not access the file system and instead is passed the contents of the file,
                //in addition to pulling data you will also pull the property request
                const{data,request} = await axios.get(args.path);
                console.log(request)
                //assign the object to the result variable
                //result is returned as type esbuild.onloadresult 
                const result:esbuild.OnLoadResult = {  
                    loader: 'jsx',
                    contents: data,
                    //resolveDir instructs esbuild to determine the exact path to the package that is found be it src or whatever extended directory
                    //first argument instructs it to not grab the index file, second argument tells it to grab the entire url from the response sent back from the server, and .pathname is the path that is separate from the importer path, which is the file path, or url that contains the require import for this file
                    resolveDir: new URL('./',request.responseURL).pathname
                };
                    // in setItem for first argument provide a key for some sort of data you want to store in the db
                    //first argument is args.path for the key
                    //second argument you provide the value for the key
                    //stores information under the key args.path
                await fileCache.setItem(args.path,result);
                return result

            });
        }
    }
}