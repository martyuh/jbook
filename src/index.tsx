//import bulmaswatch theme
import 'bulmaswatch/superhero/bulmaswatch.min.css'
import ReactDOM from "react-dom";
import CodeCell from './components/code-cell';


//bundlers are used for browsers that don't utilize module systems which are imported/exported 
const App = () => {
    
    return <div>
      {/* show one instance of codecell component */}
      <CodeCell/>
      <CodeCell/>
    </div >
}



ReactDOM.render(
    <App />,
    document.querySelector('#root')
)