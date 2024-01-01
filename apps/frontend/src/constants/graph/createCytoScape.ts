import cytoscape from "cytoscape"

export const createCytoScape = (elements: cytoscape.ElementDefinition[]): cytoscape.CytoscapeOptions =>
({

  container: document.getElementById('cy'), // container to render in
  elements,
  wheelSensitivity: 0.2,
  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(id)'
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier'
      }
    }
  ],

  layout: defaultLayout
})

const defaultLayout = {
    name: 'breadthfirst',
    fit: true, // whether to fit the viewport to the graph
    directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
    // padding: 30, // padding on fit
    circle: true, // put depths in concentric circles if true, put depths top down if false
    grid: false, // whether to create an even grid into which the DAG is placed (circle:false only)
    spacingFactor: 2.5, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
    // boundingBox: {x1: 700, y1: 50, w: 1000, h: 1000}, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
    // nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout algorithm
    // roots: undefined, // the roots of the trees
    // depthSort: ((a,b) => a.id.length - b.id.length), // a sorting function to order nodes at equal depth. e.g. function(a, b){ return a.data('weight') - b.data('weight') }
    // animate: false, // whether to transition the node positions
    // animationDuration: 500, // duration of animation in ms if enabled
    // animationEasing: undefined, // easing of animation if enabled,
    // ready: undefined, // callback on layoutready
    // stop: undefined, // callback on layoutstop
}



// TO PREVENT GOING TO THE SAME PATHS TWICE, EACH TIME I KNOW IF A NODE IS SHIT, I WILL SAVE IT, SO THE NEXT TIME I LOOK AT IT, I WONT
// HAVE TO GO THROUGH IT'S CHILDREN AGAIN.