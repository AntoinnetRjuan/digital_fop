import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { login, reset } from '../features/auth/authSlice'
import { toast } from 'react-toastify';
import { userContext } from './Context';

function Login() {
    const [formData, setFormData] = useState({
        "email": "",
        "password": "",
    })
    const { setUser } = useContext(userContext)

    const [token] = useState(JSON.parse(localStorage.getItem('user')))

    const { email, password } = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
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
    useEffect(() => {
        if (isError) {
            toast.error("Mot de passe incorrect ou l'utilisateur inconnu")
        }

        if (isSuccess || user) {



            if (user.redirect_url === "/admin") {
                if (JSON.parse(localStorage.getItem('user'))) {

                    setUser(JSON.parse(localStorage.getItem('user')))

                    window.location.href = "http://localhost:8000/admin";
                }
            } else {
                if (JSON.parse(localStorage.getItem('user'))) {

                    setUser(JSON.parse(localStorage.getItem('user')))
                    navigate("/dashboard");
                    toast.success("Bienvenue sur le tableau de bord !");
                }
            }
        }
       
        dispatch(reset());
    }, [isError, isSuccess, user, message, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-transparent">
            <div className="flex flex-wrap bg-white rounded-lg shadow-lg overflow-hidden md:w-1/2 w-full lg:w-1/2">

                <div className="hidden md:block w-1/2 bg-cover bg-center animate__animated animate__flipInY"
                    style={{ backgroundImage: "url('../../public/login2.jpg')",width: "45%",
                        height: "auto",backgroundSize: "cover",
                        backgroundPosition: "center", }}>
                </div>

                <div className="w-full md:w-1/2 p-6 animate__animated animate__jackInTheBox">
                    <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">Se connecter</h1>
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
                                placeholder="Mot de passe"
                                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <a href="/resetpassword" className="text-sm text-indigo-500 hover:underline">
                                Mot de passe oublié ?
                            </a>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-800 to-teal-200 hover:from-blue-400 hover:to-yellow-200 ..."
                        >
                            Se connecter
                        </button>
                    </form>
                </div>
            </div>
        </div>

    );
}

export default Login;