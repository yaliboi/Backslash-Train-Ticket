import axios, {AxiosRequestConfig} from 'axios'

export const axiosWithCookies = (config: AxiosRequestConfig) => 
    axios({...config, baseURL: import.meta.env.VITE_API_URL})