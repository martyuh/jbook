import * as esbuild from 'esbuild-wasm';

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

export const unpkgPathPlugin = () => {
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
            //handle root entry file of 'index.js'
            build.onResolve({filter:/(^index\.js$)/},()=>{
                return{
                    path:'index.js',
                    namespace:'a'
                }
            })
            //filter uses regular expression to find relative path for ./ and ../
            //handle relative paths in a module
            build.onResolve({filter:/^\.+\//},(args:any)=>{
                //use a new url constructor to customize the path
                //finding relative module or relative file inside a module
                return{
                    namespace: 'a',
                    // this is to customize the path in order to grab the file. in this case path will be ./util or ../util it will then be concatenated to the importer in this case it will be the file that is trying to import this path which is this case is args.importer + '/' which is unpkg.com/medium-test-pkg/
                    // we do not care about the entire object, we just want the url which can be found via .href
                    //to handle being redirected concantenate args.resolvDir to the file that the request is being held
                    path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href
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
            //handle main file of a module
            build.onResolve({ filter: /.*/ }, async (args: any) => {   

                //for an onResolve call for a file with a path other than index.js you would return an object with namespace and path that is a template string, with the package name, which is args.path, for the path
                //find the main file
                return{
                    namespace: 'a',
                    path: `https://unpkg.com/${args.path}`
                }

            });

        },
    };
};
