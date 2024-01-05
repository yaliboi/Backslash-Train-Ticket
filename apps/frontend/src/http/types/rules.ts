import { FilterOption } from "types"

export type AllowedRule = {
    field: FilterOption['field']
    operator: FilterOption['filterType']
    value: string
}