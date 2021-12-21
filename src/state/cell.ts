//interface the defines all the properties of a cell

//define the celltype as being code or text
//other bell types can be added such as 'javascript' and so on
export type CellTypes = 'code' | 'text';

//define and export an interface
export interface Cell{
    //identies each cell
    id:string;
    //code or markdown documentation cell
    type: CellTypes;
    // the code or text in a code or text cell
    content: string;
}