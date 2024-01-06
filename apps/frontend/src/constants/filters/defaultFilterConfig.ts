import { Combinator, Field, Operator } from "react-querybuilder"

export const defaultFilterConfig: FilterConfig = {
    fields: [
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
        },
        { name: 'name', label: 'Node Name'},
    ],

    operators: [
        { name: 'ENDS_WITH', label: 'In last node' },
        { name: 'INCLUDES', label: 'In any node' },
        { name: 'STARTS_WITH', label: 'In first node' },
    ],

    combinators:[
        {name: 'and', label: 'AND'}
    ]
}

type FilterConfig = {
    combinators: Combinator[]
    operators: Operator[]
    fields: Field[]
}