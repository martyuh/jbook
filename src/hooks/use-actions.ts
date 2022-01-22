//custom hook to dispatch actions
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from '../state'

export const useActions = () => {
    //access to the dispatch function
    const dispatch = useDispatch();

    //bind all the action creators to the dispatch function
    //updateCell is from actionCreators
    return bindActionCreators(actionCreators, dispatch)
}

//to use this custom  hook 
//const {updateCell} = useActions()
//updateCell(dsfddfdsfd)