// import { FrontGraphData } from 
import styles from '../../../assets/custom-classes/graph.module.scss'
import { SetStateAction, useEffect, useState } from 'react';
import { Combinator, Field, Operator, QueryBuilder, RuleGroupType } from 'react-querybuilder';

type Props = {
    setQuery: React.Dispatch<React.SetStateAction<RuleGroupType | undefined>>
}

export const GraphFilter: React.FC<Props> = ({setQuery}) => {
    
    const fields: Field[] = [
        { name: 'kind', label: 'Node Kind',
        valueEditorType: 'select', values: [
                {label: 'Sink', name: 'sink'},
                {label: 'Service', name: 'service'}
            ]  
        },
        { name: 'vulnerabilities', label: 'Vulnerabilities',
            valueEditorType: 'select', values: [
                {label: 'At least one', name: 'atLeastOne'}
            ] 
        },
        { name: 'publicExposed', label: 'Public Exposed',
            valueEditorType: 'select', values: [
                {label: 'True', name: 'true'},
                {label: 'False', name: 'false'}
            ]         
        }
    ]

    const operators: Operator[] = [
        { name: 'ENDS_WITH', label: 'In last node' },
        { name: 'INCLUDES', label: 'In any node' },
        { name: 'STARTS_WITH', label: 'In first node' },
    ]

    const combinators: Combinator[] = [
        {name: 'and', label: 'AND'}
    ]

    // const [startsWithFilters, setStartsWithFilters] = useState(false)
    // const [endsWithFilters, setEndsWithFilters] = useState(false)
    // const [includesWithFilters, setIncludesFilters] = useState(false)


    const onQueryChange = (query: RuleGroupType) => {
        setQuery(query)
    }

    return (<div className={styles['filters']}>
            <QueryBuilder onQueryChange={onQueryChange} combinators={combinators} operators={operators} fields={fields}
            controlClassnames={{addGroup: styles['hide'], combinators: styles['hide'], addRule: styles['add-rule']}}/>
    </ div>)
}