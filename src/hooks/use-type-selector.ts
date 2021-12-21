//create a type selector hook for the redux store to annotate the type that is inside the store.
import { useSelector,TypedUseSelectorHook } from "react-redux";
import { RootState } from "../state";

//allows for useTypedselector to have access to type of data/state stored in the store 
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
