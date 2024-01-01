import { db } from "../knex"
import { User } from "../../types/users.domain"

const usersDbContext = () => db('users')

const getUser = async (username: string, password?: string) => {
    const query = usersDbContext().select('*')
    .where('username', username)
    
    if(password) query.andWhere('password', password)

    const ret = (await query)[0]
    
    return  ret
}

const saveUser = async (user: User) => {
    const query = usersDbContext().insert(user)
    .onConflict('username').merge().returning("*")

    const ret = await query

    return ret
}

export const usersRepository = {
    get: getUser,
    save: saveUser
}