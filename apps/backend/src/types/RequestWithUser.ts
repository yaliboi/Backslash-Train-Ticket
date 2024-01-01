import { Request } from 'express'
import { User } from './users.domain'

import { Filter } from 'types'

export type Shit = Filter

export type RequestWithUser = Request & {user: User}