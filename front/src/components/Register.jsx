import React from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { register, reset } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { Puff } from 'react-loader-spinner'

const Register = () => {
    const [formData, setFormData] = useState({
        "nom": "",
        "prenom": "",
        "email": "",
        "password": "",
        "re_password": "",
    })

    const { nom, prenom, email, password, re_password } = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
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

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess || user) {
            window.location.href = "/login";
            toast.success("l'inscription effectué avec succes,maintenant attendez le confirmation du superadmin")
        }
        dispatch(reset())
    }, [isError, isSuccess, user, message, navigate])
    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-transparent">
                <div className="flex bg-white rounded-lg shadow-lg overflow-hidden w-1/2">
                    <div className="hidden md:block w-1/2 bg-cover bg-center animate__animated animate__flipInY"
                        style={{
                            backgroundImage: "url('../../public/register.jpg')", width: "50%",
                            height: "auto", backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}>
                    </div>
                    <div className="w-full max-w-md bg-white rounded-lg p-7 animate__animated animate__jackInTheBox">
                        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Créer un compte</h1>
                        {isLoading && (
                            <div className="flex justify-center">
                                        <Puff
                                          height="50"
                                          width="50"
                                          color="#4A90E2"
                                          ariaLabel="loading"
                                        />
                                      </div>
                        )}
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
                                className="w-full px-4 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-800 to-teal-200 hover:from-blue-400 hover:to-yellow-200 ..."
                            >
                                Register
                            </button>
                        </form>
                        <p className="mt-4 text-sm text-center text-gray-600">
                            Avez vous déja un compte?{' '}
                            <a href="/login" className="text-indigo-500 hover:underline">
                                Se connecter
                            </a>
                        </p>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Register