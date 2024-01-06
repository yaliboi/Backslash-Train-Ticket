// import { FrontGraphData } from 
import styles from '../../../assets/custom-classes/graph.module.scss'
import { QueryBuilder, RuleGroupType, RuleType } from 'react-querybuilder';
import { defaultFilterConfig } from '../../constants/filters/defaultFilterConfig';

type Props = {
    setQuery: React.Dispatch<React.SetStateAction<RuleGroupType | undefined>>
}

const maxQueryLength = 5

export const GraphFilter: React.FC<Props> = ({setQuery}) => {
    
    const {combinators, fields, operators} = defaultFilterConfig

    const onQueryChange = (query: RuleGroupType) => {
        setQuery(query)
    }

    const onAddRule = (rule: RuleType<string, string, any, string>, _parentPath: number[], query: RuleGroupType) => {
        if(query.rules.length < maxQueryLength) return rule
        alert(`Cannot have more then ${maxQueryLength} rules`) //TODO: add proper toast
        return false
    }

    return (<div className={styles['filters']}>
            <QueryBuilder onQueryChange={onQueryChange} onAddRule={onAddRule} combinators={combinators} operators={operators} fields={fields}
            controlClassnames={{addGroup: styles['hide'], combinators: styles['hide'],
            addRule: styles['add-rule'], rule: styles['rule']}}
            />
    </ div>)
}