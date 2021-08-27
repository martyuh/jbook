import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
    // returns an object that is a plugin that works inside of esbuild
    return {
        // two different properties
        //name property is mainly for debugging. usually there are several plugins, this property is just the identifier for it
        name: 'unpkg-path-plugin',
        //setup function is called by esbuild by the single build argument
        //build represents the entire bundling process
        setup(build: esbuild.PluginBuild) {
            //the two primary ways to interact with the build process is to attach event listeners to onResolve and onLoad events
            //onResolve is called when esbuild is trying to figure out a path to a particulaR module
            //onResolve overrides esbuilds process of trying to figure out where a file is stored, the path.
            //that path is returned to esbuild
            //the argument with an object with filter is to allow multiple onResolves and onloads because it provides a regular expression to indicate the different type of files
            //for instance you might want one version to load a js file and another onResolve to load a typescript file. the filter expression will control which onResolves load. they're executed against the file name that you're trying to load
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                console.log('onResolve', args);
                // namespace allows you to apply the namespace to a specific set of files with namespace of 'a' applied to them
                //if onload has a second argument namespace:'b', it will break because it will only apply to files with a namespace of 'b'
                //you want to provide a path to tiny-test-pkg
                //use a crude conditional as an example
                if(args.path==='index.js') return {path:args.path,namespace:'a'}
                else if (args.path==='tiny-test-pkg') return{path:'https://unpkg/tiny-test-p'}
            });
            //when the path to the file that is loaded to be bundled in the app is determined the onLoad step attempts to load the file
            //overrides esbuilds process of loading a file from a file system
            //it insteads returns an object with the contents of the file that you're trying to load
            //conditional checks to see if esbuild is trying to load its normal process of loading index.js from the file system return the object with the content
            //after it returns the object to esbuild, esbuild will try to load the files that are imported, in this case there are, which will then result esbuild repeating the steps of running onResolve where it will indicate where the message.js file is
            //once it returns that path, it will attempt to load the file.
            //the conditional this time around will determine that if onload is trying to load any other file than index.js else will run and return the contents of that file.
            build.onLoad({ filter: /.*/ }, async (args: any) => {
                console.log('onLoad', args);
//hard coded files to allow esbuild to simulate bundling two files of message.js and index.js
                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        contents: 
                      //simulate what a user will do in terms of entering an import
                      //in this case we're entering in 'tiny-test-pkg' into where the user's simulated entry would be
                        `
              import message from 'tiny-test-pkg';
              console.log(message);
            `, 
                    };
                } 
                // instead of having this hard coded fetch it above off of unpkg
                // else {
                //     return {
                //         loader: 'jsx',
                //         contents: 'export default "hi there!"',
                //     };
                // }
            });
        },
    };
};
