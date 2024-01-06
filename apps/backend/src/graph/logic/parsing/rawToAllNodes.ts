import { AllNodesWithValidations } from "../../../types/graph/allNodes";
import { RawGraphData } from "../../../types/graph/rawGraphData";

export const rawToAllNodes = (raw: RawGraphData): AllNodesWithValidations => {
    const allNodes = {}
    raw.nodes.forEach(node => allNodes[node.name] = {...node, validations: {checked: false}}) // now we have easy access to all the nodes
    return allNodes
}