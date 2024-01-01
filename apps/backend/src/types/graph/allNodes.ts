import { RawNode } from "./rawGraphData"

export type AllNodes = {
    [key: string]: RawNode
}

export type AllNodesWithValidations = {
    [key: string]: NodeWithValidations
}

export type NodeWithValidations = RawNode & {
    validations: {
        includes?: boolean // will be if one of it's children or their children satisfies the includes filtering 
        endsWith?: boolean // will be true if one of it's final children satisfies the ends with filtering, all other children would be filtered out. 
        startsWith?: boolean // will be true if one of it's root parents satisfies the filtering
        //checkedEndsWith // will be true if its a bottom node or if all it's children already have this property as
        checked: boolean // will be true if this component had been checked, prevents checking it twice, both from other trees and if there are inner circular refrences just in case
    }
}