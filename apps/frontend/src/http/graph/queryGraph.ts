import { axiosWithCookies } from "../axios"

export const queryGraph = async () => {
    return axiosWithCookies({
        url: 'api/graph',
        method: 'post'
        // data: user
    })
}