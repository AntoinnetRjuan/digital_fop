import React from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {useDispatch, useSelector} from 'react-redux'
import { register, reset } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const [formData,setFormData] = useState({
        "nom": "",
        "prenom": "",
        "email": "",
        "password": "",
        "re_password": "",
    })

    const {nom, prenom, email, password, re_password} = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]:e.target.value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (password !== re_password) {
            toast.error("le password no valid");
        } else {
            const userData = {
                nom,
                prenom, 
                email, 
                password, 
                re_password
            }
            dispatch(register(userData))
        }
    }

    useEffect(()=>{
        if (isError) {
            toast.error(message)
        }

        if (isSuccess || user) {
            navigate("/")
            toast.success("an activation mail has been sent to your email,please check your email")
        }
        dispatch(reset())
    }, [isError, isSuccess, user, message, navigate])
  return (
    <>
       <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="nom"
                            placeholder="Nom"
                            value={formData.nom}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="prenom"
                            placeholder="Prenom"
                            value={formData.prenom}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            name="password"
                            placeholder="Mot de passe"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            name="re_password"
                            placeholder="Confirmer le mot de passe"
                            value={formData.re_password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-indigo-500 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    </>
  )
}

export default Register