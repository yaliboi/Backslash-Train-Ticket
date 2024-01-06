import { PresentableGraphData, PresentableNode } from "types";
import { RawEdge, RawGraphData } from "../../../types/graph/rawGraphData";
import { getAllNodes } from "../../../db/db";

export const rawToPresentableGraphDataParser = (raw: RawGraphData): PresentableGraphData => {
    const parsedEdges = parseRawEdgesToPresentable(raw.edges)

    const parsedNodes: PresentableNode[] = raw.nodes.map(node => ({data: {id: node.name, label: node.name}}))

    const final = [...parsedNodes, ...parsedEdges]

    return final
}

export const parseRawEdgesToPresentable = (edges: RawEdge[]) => {
    return parseRawEdgesToSimple(edges).map(edge => ({data: edge}))

}

export const parseRawEdgesToSimple = (edges: RawEdge[]) => {
    const allNodes = getAllNodes()
    return edges.map(edge => {
        const to = Array.isArray(edge.to) ? edge.to : [edge.to] //sometimes the to is just a string, so we convert it to an array
        return to.filter(t => allNodes[t] !== undefined) // if the node we are refering to dosn't exist, then the link shouldn't exist aswell
        .map(t => ({source: edge.from, target: t}))
    }).flat(1)
} 