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
        <div>Register</div>
        {isLoading && <Spinner/>}
        <div>
            <form action="#">
                <input type='text'
                       placeholder='Nom' 
                       name='nom'
                       onChange={handleChange}
                       value={nom} 
                       required/>
                <input type="text" 
                       placeholder='Prenom' 
                       name='prenom'
                       onChange={handleChange}
                       value={prenom}  
                       required/>
                <input type="email"
                       placeholder='Email' 
                       name='email'
                       onChange={handleChange}
                       value={email}  
                       required/>
                <input type="password" 
                       placeholder='Mot de passe' 
                       name='password'
                       onChange={handleChange}
                       value={password}  
                       required/>
                <input type="password" 
                        placeholder='Confirmer le mot de passe' 
                        name='re_password'
                        onChange={handleChange}
                       value={re_password}  
                        required/>
                <button type='submit' onClick={handleSubmit}>Register</button>
            </form>
        </div>
    </>
  )
}

export default Register