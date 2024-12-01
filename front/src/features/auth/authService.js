import axios from "axios"

const BACKEND_DOMAIN = "http://localhost:8000"

const REGISTER_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/`
const LOGIN_URL = `${BACKEND_DOMAIN}/api/v1/auth/jwt/create/`
const ACTIVATE_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/activation/`
const RESET_PASSWORD_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password/`
const RESET_PASSWORD_CONFIRM_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password_cofirm/`

//Register user

const register = async (userData) => {
    const config = {
        headers:{
            "Content-type": "application/json"
        }
    }
    const response = await axios.post(REGISTER_URL,userData,config)
    return response.data
}

//Login user

const axiosInstance = axios.create({
    baseURL: BACKEND_DOMAIN,
    withCredentials: true, // Inclure les cookies
    headers: {
      "Content-Type": "application/json",
    },
});

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


const authService = {register, login, logout, activate}
export default authService

