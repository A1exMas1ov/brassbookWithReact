import axios from "axios";
import { TokenResponse } from "../models/response/TokenResponse.ts";

export const API_URL = 'http://localhost:8080/api/v1'

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

$api.interceptors.response.use((config) => {
    return config
}, async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401) {
        try {
            const refreshToken = localStorage.getItem('refreshToken')
            const response = await axios.get<TokenResponse>(`${API_URL}/token/refresh`, {
                headers: { Authorization: `Bearer ${refreshToken}` }
            })
            localStorage.setItem('token', response.data.accessToken)
            localStorage.setItem('refreshToken', response.data.refreshToken)
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
            return $api.request(originalRequest)
        } catch (refreshError) {
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login'
        }
    }
    return Promise.reject(error)
});

export default $api;