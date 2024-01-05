import { FilterOption } from "types"
import { axiosWithCookies } from "../axios"
import { RuleGroupType } from "react-querybuilder"
import { AllowedRule } from "../types/rules"

export const queryGraph = async (query: RuleGroupType | undefined) => {
    const filters = query ? query.rules.map(r => queryRuleToFilterOption(r as AllowedRule)) : []

    console.log(filters);
    
    
    return axiosWithCookies({
        url: 'api/graph',
        method: 'post',
        data: filters,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const queryRuleToFilterOption = (rule : AllowedRule): FilterOption => { //conversion between front and back types
    let values: FilterOption['values'] = [rule.value]

    if(rule.value === 'sink' && rule.field === 'kind') values = ["sqs", "rds"]
    if(rule.value === 'atLeastOne') values = undefined
    if(rule.value === 'false') values = [false]
    if(rule.value === 'true') values = [true]

    return {
        field: rule.field,
        filterType: rule.operator,
        values
    }
}
