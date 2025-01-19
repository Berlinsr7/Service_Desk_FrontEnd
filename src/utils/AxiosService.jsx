import axios from "axios";

let AxiosService = axios.create({
    baseURL:"https://service-desk-backend-8pl7.onrender.com",
    headers:{
        "Content-Type":"application/json"
    }
})

AxiosService.interceptors.request.use((config)=>{

    if(config.authenticate)
    {
        let token = sessionStorage.getItem('token')
        if(token)
        {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config

},(error)=>{
    return Promise.reject(error)
})
export default AxiosService
