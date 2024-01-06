import { FilterOption, PresentableEdge, PresentableGraphData, PresentableNode } from "types"
import { parseRawEdgesToPresentable, rawToPresentableGraphDataParser } from "./parsing/rawToPresentableGraphDataParser"
import { isNodeValid } from "./isNodeValid"
import { getAllNodes, getRawData } from "../../db/db"
import { rawToValidEdges } from "./parsing/rawToValidEdges"

export const queryGraph = (filters: FilterOption[]) => {
    const raw = getRawData()

    if(filters.length === 0) return rawToPresentableGraphDataParser(raw)

    const startsWithFilters = filters.filter(f => f.filterType === 'STARTS_WITH')
    const endsWithFilters = filters.filter(f => f.filterType === 'ENDS_WITH')
    const includesFilters = filters.filter(f => f.filterType === 'INCLUDES')

    const nodesWithValidations = getAllNodes()

    Object.values(nodesWithValidations).forEach(node => {
        if(startsWithFilters.length > 0) nodesWithValidations[node.name].validations.startsWith = false
        if(includesFilters.length > 0) nodesWithValidations[node.name].validations.includes = {above: false, below: false}
        if(endsWithFilters.length > 0) nodesWithValidations[node.name].validations.endsWith = false
    })

    const edges = rawToValidEdges(raw.edges)

    const allTreeRoots = raw.nodes.filter(node => !edges.find(edge => edge.to.includes(node.name))).map(node => node.name)
    const allBottomNodes = raw.nodes.filter(node => !edges.find(edge => edge.from === node.name)).map(node => node.name)

    let layerNodes = [...allTreeRoots]

    //searching and updating layer by layer, until the final child knows everything about the route, then updating backwards layer by layer
    while(layerNodes.length > 0){
        const newLayerNodes = new Set<string>() // preventing duplicate values
        layerNodes.forEach(currentNodeId => {
            const currentNode = nodesWithValidations[currentNodeId]
            const isBottomNode = allBottomNodes.includes(currentNodeId)
            if(!currentNode.validations.checked){// if this node had already been validated then there is no need to validate again
                currentNode.validations.checked = true
                
                if(startsWithFilters.length > 0 && allTreeRoots.includes(currentNodeId)){ //if there is starts with filtering and this is a starting node
                    currentNode.validations.startsWith = isNodeValid(currentNode, startsWithFilters)
                }    
                
                if(includesFilters.length > 0 && currentNode.validations.includes.above === false){
                    const valid = isNodeValid(currentNode, includesFilters)
                    currentNode.validations.includes.above = valid
                    currentNode.validations.includes.below = valid 
                }
                
                if(endsWithFilters.length > 0 && currentNode.validations.endsWith === false && isBottomNode){
                    currentNode.validations.endsWith = isNodeValid(currentNode, endsWithFilters)
                }
            }
                
            if(!isBottomNode){ // if not the final node then keep searching, updating our node's parameters accordingly
                const currentEdges = edges.find(edge => edge.from === currentNodeId)
                
                if(currentEdges){
                    const children = [currentEdges.to].flat(1)
                
                    children.forEach(child => {
                        // child inherits current node's validations, only if they are true (beacuse its like an OR statement betwen this link and other links)
                        if(nodesWithValidations[child].validations.startsWith === false) nodesWithValidations[child].validations.startsWith = currentNode.validations.startsWith 
                        if(nodesWithValidations[child].validations.includes && nodesWithValidations[child].validations.includes.above === false) nodesWithValidations[child].validations.includes.above = currentNode.validations.includes.above 
                        if(nodesWithValidations[child].validations.endsWith === false) nodesWithValidations[child].validations.endsWith = currentNode.validations.endsWith 
                        newLayerNodes.add(child) // the child belongs to the new layer
                    })
                }
            }
        })
        layerNodes = Array.from(newLayerNodes.values())
    }

    layerNodes = [...allBottomNodes]

    while(layerNodes.length > 0){ // we go back, updating the parents
        const newLayerNodes = new Set<string>()
        layerNodes.forEach(currentNodeId => {
            const parents = edges.filter(edge => edge.to.includes(currentNodeId)).map(e => e.from)
            
            parents.forEach(parent => {
                //the parent may not know what the child knows about the route's includes and ends with validations, so the child notifies it
                if(nodesWithValidations[parent].validations.includes && nodesWithValidations[parent].validations.includes.below === false) nodesWithValidations[parent].validations.includes.below = nodesWithValidations[currentNodeId].validations.includes.below
                if(nodesWithValidations[parent].validations.endsWith === false) nodesWithValidations[parent].validations.endsWith = nodesWithValidations[currentNodeId].validations.endsWith
                newLayerNodes.add(parent) // adding the parent
            })
        })
        layerNodes = Array.from(newLayerNodes.values())
    }
    
    let finalNodes: PresentableNode[] = []
    Object.values(nodesWithValidations).forEach((node) => {
        if(node.validations.endsWith !== false && (node.validations.includes === undefined || (node.validations.includes.above !== false || node.validations.includes.below !== false)) && node.validations.startsWith !== false){ // all validations passed 🎉🎉🎉
            finalNodes.push({data: {id: node.name, label: node.name}})
        }
    })
    
    const seperatedEdges = parseRawEdgesToPresentable(edges)

    let finalEdges: PresentableEdge[]
    let keepSearching = true

    // if a node has no parents and isn't a root node then it's irelevant, it and it's children should be deleted.
    // example how this can happen - one parent has a startsWith validation correct and another has an includes validation correct.
    // in this case the child would have no parents beacuse neither have both validation but the child does. it should be deleted
    while(keepSearching){ 
        keepSearching = false //TODO: turn this into a recoursive function
        finalEdges = seperatedEdges.filter(edge => finalNodes.some(node => node.data.id === edge.data.source) && finalNodes.some(node => node.data.id === edge.data.target)) // only include edges that have both nodes valid

        finalNodes = finalNodes.filter(node => {
            if(allTreeRoots.includes(node.data.id) || finalEdges.some(edge => edge.data.target === node.data.id)){
                return true
            }
            else{
                keepSearching = true // we just deleted a node, maybe it also has children that need to be deleted
                return false
            }
        })
    }

    const final: PresentableGraphData = [...finalNodes, ...finalEdges]

    return final
}