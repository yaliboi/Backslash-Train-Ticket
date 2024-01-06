import axios, {AxiosRequestConfig} from 'axios'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const axiosWithCookies = (config: AxiosRequestConfig) => 
    axios({...config, baseURL})