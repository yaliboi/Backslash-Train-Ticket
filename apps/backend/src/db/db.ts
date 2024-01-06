import { rawToAllNodes } from '../graph/logic/parsing/rawToAllNodes'
import { RawGraphData } from '../types/graph/rawGraphData'
import raw from './train-ticket-fs.json'

export const getRawData = () => ({...raw}) as RawGraphData
export const getAllNodes = () => rawToAllNodes(getRawData())
// export c