//import bulmaswatch theme
import 'bulmaswatch/superhero/bulmaswatch.min.css'
import ReactDOM from "react-dom";
// import CodeCell from './components/code-cell';
import TextEditor from './components/text-editor';

//bundlers are used for browsers that don't utilize module systems which are imported/exported 
const App = () => {
    
    return <div>
      {/* show one instance of codecell component */}
      <TextEditor/>
    </div >
}



ReactDOM.render(
    <App />,
    document.querySelector('#root')
)