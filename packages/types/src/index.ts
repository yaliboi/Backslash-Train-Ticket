export type PresentableGraphData = (PresentableEdge | PresentableNode)[]

export type PresentableNode = {
    data: {
        id: string
        label: string
    }
}

export type PresentableEdge = {
    data: {
        source: string
        target: string
    }
}

export type FilterType = 'ENDS_WITH' | 'STARTS_WITH' | 'INCLUDES'

export type FilterOption = {
    filterType: FilterType,
    field: string,
    values?: (string | boolean | number)[]
}