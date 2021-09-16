import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage'


//object that interacts with an instance of the indexdb database inside the browser
const fileCache =localForage.createInstance({
    //pass in configuration object
    //all you need is the name for the the db that's created
    name: 'filecache'
});
//this function is for testing purposes
//immediately invoke the function by placing it inside parantheses
//set or get an item from the db
// (async ()=>{
    // in setItem for first argument provide a key for some sort of data you want to store in the db
    //second argument you provide the value for the key
    //stores information under the key color
    // await fileCache.setItem('color','red');

    //it can be retrieved later on under the key color
//     const color = await fileCache.getItem('color');
//     console.log(color)
// })()
// argument to accept input code from user
export const unpkgPathPlugin = (inputCode: string) => {
    // returns an object that is a plugin that works inside of esbuild
    return {
        // two different properties
        //name property is mainly for debugging. usually there are several plugins, this property is just the identifier for it
        name: 'unpkg-path-plugin',
        //setup function is called by esbuild by the single build argument
        //build represents the entire bundling process
        setup(build: esbuild.PluginBuild) {
            //filter uses regular expression to find the exact file name with no characters in front or after
            //function for index.js does not need to be async because it is dealing with index.js only
            // namespace allows you to apply the namespace to a specific set of files with namespace of 'a' applied to them
            //if onload has a second argument namespace:'b', it will break because it will only apply to files with a namespace of 'b'
            build.onResolve({filter:/(^index\.js$)/},()=>{
                return{
                    path:'index.js',
                    namespace:'a'
                }
            })

            //the two primary ways to interact with the build process is to attach event listeners to onResolve and onLoad events
            //onResolve is called when esbuild is trying to figure out a path to a particulaR module
            //onResolve overrides esbuilds process of trying to figure out where a file is stored, the path.
            //that path is returned to esbuild
            //the argument with an object with filter is to allow multiple onResolves and onloads because it provides a regular expression to indicate the different type of files
            //filter object controls whether a given file that esbuild is trying to resolve a path for should use the function in the second argument
            //for instance you might want one version to load a js file and another onResolve to load a typescript file. the filter expression will control which onResolves load. they're executed against the file name that you're trying to load
            //you can use filter to resolve a path instead of the conditionals below
            build.onResolve({ filter: /.*/ }, async (args: any) => {   
                //use a new url constructor to customize the path
                //finding relative module or relative file inside a module
                //this conditional determines if the file has a ./ or ../ slash in it
                if(args.path.includes('./')||args.path.includes('../')){
                    return{
                        namespace: 'a',
                        // this is to customize the path in order to grab the file. in this case path will be ./util or ../util it will then be concatenated to the importer in this case it will be the file that is trying to import this path which is this case is args.importer + '/' which is unpkg.com/medium-test-pkg/
                        // we do not care about the entire object, we just want the url which can be found via .href
                        //to handle being redirected concantenate args.resolvDir to the file that the request is being held
                        path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href
                    }
                }

                //for an onResolve call for a file with a path other than index.js you would return an object with namespace and path that is a template string, with the package name, which is args.path, for the path
                //find the main file
                return{
                    namespace: 'a',
                    path: `https://unpkg.com/${args.path}`
                }

            });
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
                console.log('onLoad', args);
//hard coded files to allow esbuild to simulate bundling two files of message.js and index.js
                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        // user code that is inputed
                        contents: inputCode

, 
                    };
                } 
                //check to see if the imported file is in the cache
                //for the keys, use args.path
                //typescript does not know what type of value cachedResult is
                //getItem is a generic function so you can put in <es.onloadresult> to indicate the type of value it will return for cachedResult. when moused over you will see that it will be cachedResult or null
                const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path)
                //if it is in the db, it will be the object with loader,contents and resolvDir, return it immediately
                if(cachedResult) return cachedResult
                //if it is not, allow the request to path to run and store the response in cache
                //for the value, store the result object with the loader,contents and resolvDir

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
                    // esbuild is going to process jsx within the file
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
        },
    };
};
