import { Graph } from "../components/graph/Graph"
import styles from '../../assets/custom-classes/graph.module.scss'
import { GraphFilter } from "../components/graph/GraphFilter"
import { useEffect, useState } from "react"
import { RuleGroupType } from "react-querybuilder"

export const GraphPage: React.FC = () => {

    const [query, setQuery] = useState<RuleGroupType>()

    return (<div className={styles['graph-page']}>
        <div className={styles['graph-header']}>
            Train Ticket Graph
        </div>
        <GraphFilter setQuery={setQuery} />
        <Graph query={query}/>
    </ div>)
}