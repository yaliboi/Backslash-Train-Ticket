import { FilterOption, PresentableGraphData, PresentableNode } from "types"
import { parseRawEdgesToPresentable } from "./rawToPresentableGraphDataParser"
import { isNodeValid } from "./isNodeValid"
import { getAllNodes, getRawData } from "../../db/db"

export const queryGraph = (filters: FilterOption[]) => {
    const startsWithFilters = filters.filter(f => f.filterType === 'STARTS_WITH')
    const endsWithFilters = filters.filter(f => f.filterType === 'ENDS_WITH')
    const includesFilters = filters.filter(f => f.filterType === 'INCLUDES')

    let nodesWithValidations = getAllNodes()

    console.log(nodesWithValidations)

    Object.values(nodesWithValidations).forEach(node => {
        if(startsWithFilters.length > 0) nodesWithValidations[node.name].validations.startsWith = false
        if(includesFilters.length > 0) nodesWithValidations[node.name].validations.includes = false
        if(endsWithFilters.length > 0) nodesWithValidations[node.name].validations.endsWith = false
    })

    // let simpleEdges = parseRawEdgesToSimple(final.edges) //more convinient way to work with them

    console.log(endsWithFilters.length)

    const raw = getRawData()

    const edges = raw.edges.map(edge => {
        return {
            from: edge.from,
            to: [edge.to].flat(1).filter(to => nodesWithValidations[to] !== undefined) // if an edge connects to an undefined node, we ignore that edge
        }
    })

    const allTreeRoots = raw.nodes.filter(node => !edges.find(edge => edge.to.includes(node.name))).map(node => node.name)
    const allBottomNodes = raw.nodes.filter(node => !edges.find(edge => edge.from === node.name)).map(node => node.name)

    let layerNodes = [...allTreeRoots]

    //searching and updating layer by layer, until the final child knows everything about the route, then updating backwards layer by layer
    while(layerNodes.length > 0){
        const newLayerNodes = new Set<string>() // preventing duplicate values
        layerNodes.forEach(currentNodeId => {
            const currentNode = nodesWithValidations[currentNodeId]
            if(!currentNode.validations.checked){// if this node had already been validated then there is no need to validate again
                currentNode.validations.checked = true
                if(startsWithFilters.length > 0 && allTreeRoots.includes(currentNodeId)){ //if there is starts with filtering and this is a starting node
                    currentNode.validations.startsWith = isNodeValid(currentNode, startsWithFilters)
                }

                if(includesFilters.length > 0 && currentNode.validations.includes === false)
                    currentNode.validations.includes = isNodeValid(currentNode, includesFilters)
                

                if(endsWithFilters.length > 0 && currentNode.validations.endsWith === false)
                    currentNode.validations.endsWith = isNodeValid(currentNode, endsWithFilters)
                
                //OTHER FILTERS HERE, IN OTHER FILTERS IT DOSNT CHANGE FROM TRUE TO FALSE, ONLY FROM FALSE TO TRUE
    
                if(allBottomNodes.includes(currentNodeId)){ //if this is the final node then we stop the search
                    //BOTTOM VALIDATIONS HERE
                    // return currentNode.validations
                }
                else{ // if not the final node then keep searching, updating our node's parameters accordingly
                    const children = [edges.find(edge => edge.from === currentNodeId).to].flat(1)
                    
                    children.forEach(child => { 
                        // child inherits current node's validations, only if they are true (beacuse its like an OR statement betwen this link and other links)
                        if(nodesWithValidations[child].validations.startsWith === false) nodesWithValidations[child].validations.startsWith = currentNode.validations.startsWith 
                        if(nodesWithValidations[child].validations.includes === false) nodesWithValidations[child].validations.includes = currentNode.validations.includes 
                        if(nodesWithValidations[child].validations.endsWith === false) nodesWithValidations[child].validations.endsWith = currentNode.validations.endsWith 
                        newLayerNodes.add(child) // the child belongs to the new layer
                    })
                }
            }
        })
        layerNodes = Array.from(newLayerNodes.values())
    }

    layerNodes = [...allBottomNodes]

    // console.log(Object.values(nodesWithValidations).filter(v => v.validations.startsWith === true).length)

    while(layerNodes.length > 0){
        const newLayerNodes = new Set<string>()
        layerNodes.forEach(currentNodeId => {
            const parents = edges.filter(edge => edge.to.includes(currentNodeId)).map(e => e.from)
            
            parents.forEach(parent => { 
                //the parent may not know what the child knows about the route's includes and ends with validations, so the child notifies it
                if(nodesWithValidations[parent].validations.includes === false) nodesWithValidations[parent].validations.includes = nodesWithValidations[currentNodeId].validations.includes
                if(nodesWithValidations[parent].validations.endsWith === false) nodesWithValidations[parent].validations.endsWith = nodesWithValidations[currentNodeId].validations.endsWith
                newLayerNodes.add(parent) // adding the parent
            })
        })
        layerNodes = Array.from(newLayerNodes.values())
    }

    const finalNodes: PresentableNode[] = []
    
    Object.values(nodesWithValidations).forEach((node) => {
        if(node.validations.endsWith !== false && node.validations.includes !== false && node.validations.startsWith !== false){ // all validations passed 🎉🎉🎉
            finalNodes.push({data: {id: node.name, label: node.name}})
        }
    })

    const seperatedEdges = parseRawEdgesToPresentable(edges)

    const finalEdges = seperatedEdges.filter(edge => finalNodes.some(node => node.data.id === edge.data.source) && finalNodes.some(node => node.data.id === edge.data.target)) // only include edges that have both nodes valid

    const final: PresentableGraphData = [...finalNodes, ...finalEdges]

    //LATER CHECK THAT IT ACCTUALLY ONLY CHECKS EACH NODE ONCE
    // const validateNodes = (currentNodeId: string) => {
    //     const currentNode = nodesWithValidations[currentNodeId]
    //     if(!currentNode.validations.checked){// if this node had already been searched then there is no need to search again
    //         currentNode.validations.checked = true
    //         if(startsWithFilters.length > 0 && allTreeRoots.includes(currentNodeId)){ //if there is starts with filtering and this is a starting node
    //             currentNode.validations.startsWith = isNodeValid(currentNode, startsWithFilters)
    //         }
    //         //OTHER FILTERS HERE, IN OTHER FILTERS IT DOSNT CHANGE FROM TRUE TO FALSE, ONLY FROM FALSE TO TRUE

    //         if(allBottomNodes.includes(currentNodeId)){ //if this is the final node then we stop the search
    //             //BOTTOM VALIDATIONS HERE
    //             // return currentNode.validations
    //         }
    //         else{ // if not the final node then keep searching, updating our node's parameters accordingly
    //             const children = [edges.find(edge => edge.from === currentNodeId).to].flat(1)

    //             children.map(child => { // USE THIS TO CHOOSE MY OWN VALIDATIONS 
    //                 // const childValidations = nodesWithValidations[child]
    //                 if(nodesWithValidations[child].validations.startsWith === false) nodesWithValidations[child].validations.startsWith = currentNode.validations.startsWith // child inherits current node's validations
    //                 return validateNodes(child)
    //             })
    //         }
    //     }

    //     return currentNode.validations
    // }


    // allTreeRoots.forEach((node) => {
    //     validateNodes(node);
    // })

    return final
    

    // const invalidTreeRoots = allTreeRoots.filter(node => !isNodeValid(node, startsWithFilters)).map(node => node.name)
    // const validTreeRoots = allTreeRoots.map(node => node.name).filter(node => !invalidTreeRoots.includes(node))
    // final = cleanupDeadNodes(simpleEdges, invalidTreeRoots, validTreeRoots)

}

// const filterNodes = (): RawGraphData => {
//     let deadEdges = allEdges.filter(edge => originalInvalidNodes.includes(edge.source)) //all edges that have a dead father are dead aswell
//     let newEdges = allEdges.filter(edge => !originalInvalidNodes.includes(edge.source))
//     let deadNodes = [...originalInvalidNodes]

//     let infectedNodes = deadEdges.map(edge => edge.target).flat(1) // all nodes that lost a connection
//     while (infectedNodes.length > 0){
//         const newDeadNodes = infectedNodes.filter(node => deadEdges.includes())
//     }


//     return data
// }












// const allTreeRoots = rawData.nodes.filter(node => !edges.find(edge => edge.to.includes(node.name))).map(node => node.name)
// const allBottomNodes = rawData.nodes.filter(node => !edges.find(edge => edge.from === node.name)).map(node => node.name)

// let i = 0
// //LATER CHECK THAT IT ACCTUALLY ONLY CHECKS EACH NODE ONCE
// const validateNodes = (currentNodeId: string) => {
//     const currentNode = nodesWithValidations[currentNodeId]
//     if(!currentNode.validations.checked){// if this node had already been searched then there is no need to search again
//         currentNode.validations.checked = true
//         i += 1
//         if(startsWithFilters.length > 0 && allTreeRoots.includes(currentNodeId)){ //if there is starts with filtering and this is a starting node
//             currentNode.validations.startsWith = isNodeValid(currentNode, startsWithFilters)
//         }
//         //OTHER FILTERS HERE, IN OTHER FILTERS IT DOSNT CHANGE FROM TRUE TO FALSE, ONLY FROM FALSE TO TRUE

//         if(allBottomNodes.includes(currentNodeId)){ //if this is the final node then we stop the search
//             //BOTTOM VALIDATIONS HERE
//             // return currentNode.validations
//         }
//         else{ // if not the final node then keep searching, updating our node's parameters accordingly
//             const children = [edges.find(edge => edge.from === currentNodeId).to].flat(1)

//             children.map(child => { // USE THIS TO CHOOSE MY OWN VALIDATIONS 
//                 // const childValidations = nodesWithValidations[child]
//                 if(nodesWithValidations[child].validations.startsWith === false) nodesWithValidations[child].validations.startsWith = currentNode.validations.startsWith // child inherits current node's validations
//                 return validateNodes(child)
//             })
//         }
//     }   

//     return currentNode.validations
// }


// allTreeRoots.forEach((node) => {
//     validateNodes(node);