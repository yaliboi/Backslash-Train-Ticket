import axios, {AxiosRequestConfig} from 'axios'

export const axiosWithCookies = (config: AxiosRequestConfig) => 
    axios({...config, baseURL: import.meta.env.BASE_URL, withCredentials: true})