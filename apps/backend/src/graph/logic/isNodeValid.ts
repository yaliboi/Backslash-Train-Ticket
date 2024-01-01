import { FilterOption } from "types";
import { RawNode } from "../../types/graph/rawGraphData";

export const isNodeValid = (node: RawNode, filters: FilterOption[]) => { //checks if a specific node is valid, without checking it's children
    return filters.every(f => {
        if(f.values) return f.values.some(v => node[f.field] === v) // checking if the node's value in the wanted field is true
        else return node[f.field] !== undefined // checking if the node's field has any value
    })
}