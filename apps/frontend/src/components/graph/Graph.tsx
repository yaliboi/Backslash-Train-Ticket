import { useQuery } from 'react-query'
import { queryGraph } from '../../http/graph/queryGraph';
// import { FrontGraphData } from 
import styles from '../../../assets/custom-classes/graph.module.scss'
import { createCytoScape } from '../../constants/graph/createCytoScape';
import {PresentableGraphData} from 'types'
import { useEffect, useState } from 'react';
//@ts-ignore
import klay from 'cytoscape-cise';
import cytoscape from 'cytoscape';

type GraphQueryResults = {
    data: PresentableGraphData
}

export const Graph: React.FC = () => {

    const { isLoading, error, data } = useQuery<GraphQueryResults>({queryKey: ['graphData'], queryFn: queryGraph})

    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const graphData = data ? data.data : []
        
        cytoscape.use(klay)
        const cy = cytoscape(createCytoScape(graphData))
    }, [data])


    console.log(data)


//<CytoscapeComponent layout={defaultLayout} wheelSensitivity={0.1} zoom={0.6} panningEnabled={true} zoomingEnabled={true} elements={graphData} />
    return (<div className={styles['graph-container']}>
            <div style={{width: "100%", height: '100%'}} id='cy'/>
    </ div>)
}