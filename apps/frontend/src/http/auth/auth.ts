import { axiosWithCookies } from "../axios";
import { User } from "../types/user";

export const register = async (user: User) => {
    const response = await axiosWithCookies({
        url: 'auth/register',
        method: 'post',
        data: user
    }).then((ret) => ret)
    .catch((err) => console.log(err))

    return response
}

export const login = async (user: User) => {
    const response = await axiosWithCookies({
        url: 'auth/login',
        method: 'post',
        data: user
    }).then((ret) => ret)
    .catch((err) => console.log(err))

    return response
}