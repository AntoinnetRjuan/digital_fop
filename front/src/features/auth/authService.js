import axios from "axios"
import axiosInstance from '../../components/AxiosConfig'

//Register user

const register = async (userData) => {
    const config = {
        headers:{
            "Content-type": "application/json"
        }
    }
    const response = await axiosInstance.post('/api/v1/auth/users/',userData,config)
    return response.data
}

//Login user

const login = async (userData) => {
    const response = await axiosInstance.post("/api/v1/auth/jwt/create/", userData);
    
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
};


//Logout

const logout = ()=>{
    return localStorage.removeItem("user")
}


//activation user
const activate = async (userData) => {
    const config = {
        headers:{
            "Content-type": "application/json"
        }
    }
    const response = await axios.post(ACTIVATE_URL,userData,config)
    return response.data
}
//reset Password
const resetPassword = async (userData) => {
    const config = {
        headers:{
            "Content-type": "application/json"
        }
    }
    const response = await axiosInstance.post('/api/v1/auth/users/reset_password/',userData,config)
    return response.data
}

//reset Password
const resetPasswordConfirm = async (userData) => {
    const config = {
        headers:{
            "Content-type": "application/json"
        }
    }
    const response = await axiosInstance.post('/api/v1/auth/users/reset_password_confirm/',userData,config)
    return response.data
}

const authService = {register, login, logout, resetPassword, resetPasswordConfirm}
export default authService

