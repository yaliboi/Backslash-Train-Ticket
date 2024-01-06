// import { FrontGraphData } from 
import styles from '../../../assets/custom-classes/graph.module.scss'
import { Combinator, Field, Operator, QueryBuilder, RuleGroupType, RuleType } from 'react-querybuilder';

type Props = {
    setQuery: React.Dispatch<React.SetStateAction<RuleGroupType | undefined>>
}

const maxQueryLength = 5

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

    const onQueryChange = (query: RuleGroupType) => {
        setQuery(query)
    }

    const onAddRule = (rule: RuleType<string, string, any, string>, _parentPath: number[], query: RuleGroupType) => {
        if(query.rules.length < maxQueryLength) return rule
        alert(`Cannot have more then ${maxQueryLength} rules`)
        return false
    }

    // const canAddRule = query ? query.rules.length <= maxQueryLength : true
    
    return (<div className={styles['filters']}>
            <QueryBuilder onQueryChange={onQueryChange} onAddRule={onAddRule} combinators={combinators} operators={operators} fields={fields}
            controlClassnames={{addGroup: styles['hide'], combinators: styles['hide'],
            addRule: styles['add-rule']}} //LOOK ONLINE HOW TO DISABLE WHEN MAX 
            />
    </ div>)
}