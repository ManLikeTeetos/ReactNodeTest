import axios from "axios"
import { constant } from "../constant"


export const postApi = async (path, data, login) => {
    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token"); 
        let result = await axios.post(constant.baseUrl + path, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        if (result.data?.token && result.data?.token !== null) {
            if (login) {
                localStorage.setItem('token', result.data?.token)
            } else {
                sessionStorage.setItem('token', result.data?.token)
            }
            localStorage.setItem('user', JSON.stringify(result.data?.user))
        }
        return result
    } catch (e) {
        console.error(e)
        return e
    }
}
export const putApi = async (path, data, id) => {
    try {
       const token = localStorage.getItem("token") || sessionStorage.getItem("token"); 
        let result = await axios.put(constant.baseUrl + path, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        return result
    } catch (e) {
        console.error(e)
        return e
    }
}

export const deleteApi = async (path, param) => {
    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token"); 
        let result = await axios.delete(constant.baseUrl + path + param, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        if (result.data?.token && result.data?.token !== null) {
            localStorage.setItem('token', result.data?.token)
        }
        return result
    } catch (e) {
        console.error(e)
        return e
    }
}

export const deleteManyApi = async (path, data) => {
    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token"); 
        let result = await axios.post(constant.baseUrl + path, data, {
           headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
        })
        if (result.data?.token && result.data?.token !== null) {
            localStorage.setItem('token', result.data?.token)
        }
        return result
    } catch (e) {
        console.error(e)
        return e
    }
}

export const getApi = async (path, id) => {
    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token"); 
        if (id) {
            let result = await axios.get(constant.baseUrl + path + id, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return result
        }
        else {
            let result = await axios.get(constant.baseUrl + path, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return result
        }
    } catch (e) {
        console.error(e)
        return e
    }
}

