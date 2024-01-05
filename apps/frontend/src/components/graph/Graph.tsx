import { useQuery } from 'react-query'
import { queryGraph } from '../../http/graph/queryGraph';
// import { FrontGraphData } from 
import styles from '../../../assets/custom-classes/graph.module.scss'
import { createCytoScape } from '../../constants/graph/createCytoScape';
import {FilterOption, PresentableGraphData} from 'types'
import { useEffect } from 'react';
import cytoscape from 'cytoscape';
import { RuleGroupType } from 'react-querybuilder';

type GraphQueryResults = {
    data: PresentableGraphData
}

type Props = {
    query: RuleGroupType | undefined
}

export const Graph: React.FC<Props> = ({query}) => {

    const { isLoading, error, data, refetch } = useQuery<GraphQueryResults>({queryKey: ['graphData'], queryFn: () => queryGraph(query)})

    useEffect(() => {
        console.log('huh');
        
        refetch()
    }, [query])

    useEffect(() => {
        const graphData = data ? data.data : []
        
        const cy = cytoscape(createCytoScape(graphData))
    }, [data])


    // console.log(data)


//<CytoscapeComponent layout={defaultLayout} wheelSensitivity={0.1} zoom={0.6} panningEnabled={true} zoomingEnabled={true} elements={graphData} />
    return (<div className={styles['graph-container']}>
            <div style={{width: "100%", height: '100%'}} id='cy'/>
    </ div>)
}