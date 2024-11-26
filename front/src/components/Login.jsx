import React, { useState , useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { login, reset } from '../features/auth/authSlice'
import { toast } from 'react-toastify';

function Login() {
    const [formData, setFormData] = useState({
        "email":"",
        "password":"",
    })

    const { email, password } = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]:e.target.value
        })
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()
            const userData = {
                email, 
                password, 
            }
            dispatch(login(userData))
    }
    useEffect(()=>{
        if (isError) {
            toast.error(message)
        }

        if (isSuccess || user) {
            navigate("/dashboard")
            toast.success("Bienvenue dans le dashboard admin")
        }
        dispatch(reset())
    }, [isError, isSuccess, user, message, navigate])
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="flex items-center text-sm">
                            <input type="checkbox" className="mr-2 text-indigo-500 focus:ring-indigo-400" />
                            Remember me
                        </label>
                        <a href="/resetpassword" className="text-sm text-indigo-500 hover:underline">
                            Forgot password?
                        </a>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <a href="/register" className="text-indigo-500 hover:underline">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Login;