import { useQuery } from 'react-query'
import { queryGraph } from '../../http/graph/queryGraph';
// import { FrontGraphData } from 
import styles from '../../../assets/custom-classes/graph.module.scss'
import { createCytoScape } from '../../constants/graph/createCytoScape';
import {PresentableGraphData} from 'types'
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

    const { data, refetch } = useQuery<GraphQueryResults>({queryKey: ['graphData'], queryFn: () => queryGraph(query)})

    useEffect(() => {
        refetch()
    }, [query])

    useEffect(() => {
        const graphData = data ? data.data : []
        
        cytoscape(createCytoScape(graphData))
    }, [data])

    return (<div className={styles['graph-container']}>
            <div style={{width: "100%", height: '100%'}} id='cy'/>
    </ div>)
}