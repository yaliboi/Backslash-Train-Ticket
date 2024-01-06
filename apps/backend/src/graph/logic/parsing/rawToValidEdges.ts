import { getAllNodes } from "../../../db/db";
import { RawEdge } from "../../../types/graph/rawGraphData";

export const rawToValidEdges = (edges: RawEdge[]) => {
    const allNodes = getAllNodes()
    return edges.map(edge => {
        return {
            from: edge.from,
            to: [edge.to].flat(1).filter(to => allNodes[to] !== undefined) // if an edge connects to an undefined node, we ignore that edge
        }
    })
}