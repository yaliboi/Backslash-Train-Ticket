import { RawNode } from "./rawGraphData"

export type AllNodes = {
    [key: string]: RawNode
}

export type AllNodesWithValidations = {
    [key: string]: NodeWithValidations
}

export type NodeWithValidations = RawNode & {
    validations: {
        includes?: {
            below: boolean // if this is true, then it or one of it's children satisfies the includes filtering, so we will pass it upwards
            above: boolean // if this true, then it or one of it's parents satisfies the includes filtering, so we will pass it downwards but not upwards beacuse some of it's parents may not satisfy the includes filtering
        }  
        endsWith?: boolean // will be true if one of it's final children satisfies the ends with filtering, all other children would be filtered out. 
        startsWith?: boolean // will be true if one of it's root parents satisfies the filtering
        checked: boolean // will be true if this component had been checked, prevents checking it twice, both from other trees and if there are inner circular refrences just in case
    }
}