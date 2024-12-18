import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../features/auth/authSlice'
const ResetPassword = () => {
    const [formData, setFormData] = useState({
        "email": "",
    })

    const { email } = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const userData = {
            email
        }
        dispatch(resetPassword(userData))
    }

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }
        if (isSuccess) {
            navigate("/")
            toast.success("un email de reset password vous a été envoyer")
        }
    }, [isError, isSuccess, message, navigate, dispatch])
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
                <div className='flex bg-white rounded-lg shadow-lg overflow-hidden w-1/2'>
                    <div className="hidden md:block w-1/2 bg-cover bg-center animate__animated animate__flipInY"
                        style={{
                            backgroundImage: "url('../../public/forget.png')", width: "50%",
                            height: "auto", backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}>
                    </div>
                    <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                        <h1 className="text-xl font-semibold text-center text-gray-800 mb-4">Oublier mot de passe</h1>
                        <form action="#" className="space-y-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                value={email}
                                required
                                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="w-full px-4 py-2 text-white bg-blue-800 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                            >
                                Reset password
                            </button>
                        </form>
                    </div>
                </div>

            </div>

        </>
    )
}

export default ResetPassword