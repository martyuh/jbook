import { ResizableBox } from "react-resizable";

interface ResizableProps {
    //must provide a prop direction that is the exact string 'horizontal' or 'vertical'
    direction: 'horizontal' | 'vertical';
}

//this component allows you to resize the editor-cell 
//type definition using an interface
//receive the direction prop
//children prop is received when you try to render resizable with some other react component or text content inside of it
//children is what you want to make resizable
const Resizable:React.FC<ResizableProps> = ({direction,children}) => {
 return <div>{children}</div>
}