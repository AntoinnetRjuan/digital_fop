import React from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const ResetPassword = () => {
    const [formData,setFormData] = useState({
        "email": "",
    })

    const {email} = formData
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]:e.target.value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (email.length > 0) {
            toast.success("veillez verifier votre email");
        }
    }
  return (
    <>
        <div>Register</div>
        <div>
            <form action="#">
                <input type="email"
                       placeholder='Email' 
                       name='email'
                       onChange={handleChange}
                       value={email}  
                       required/>
                <button type='submit' onClick={handleSubmit}>Reset password</button>
            </form>
        </div>
    </>
  )
}

export default ResetPassword