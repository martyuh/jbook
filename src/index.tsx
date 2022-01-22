//import bulmaswatch theme
import 'bulmaswatch/superhero/bulmaswatch.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import {store} from './state'
// import CodeCell from './components/code-cell';
import TextEditor from './components/text-editor';
import CellList from './components/cell-list';

//bundlers are used for browsers that don't utilize module systems which are imported/exported 
const App = () => {
    
    return(
      //connect redux store to react app
      <Provider store={store}>
      <div>
      <CellList/>
    </div >
    </Provider>
    )
}



ReactDOM.render(
    <App />,
    document.querySelector('#root')
)