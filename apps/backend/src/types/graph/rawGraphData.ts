export type RawGraphData = {
    nodes: RawNode[]
    edges: RawEdge[]
}

export type RawNode = {
    name: string
    kind: NodeKind
    language?: string
    path?: string
    publicExposed?: boolean
    vulnerabilities?: object[]
    metadata: object
}

export type NodeKind = 'service' | 'sqs' | 'rds'

export type RawEdge = {
    from: string
    to: string[] | string
}

export type SimpleEdge = {
    source: string
    target: string
}