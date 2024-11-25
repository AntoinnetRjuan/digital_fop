import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { toast } from 'react-toastify'
const Menu = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user} = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate("/")
  }
  return (
    <>
       <div className='container mx-auto flex items-center'>
            <ul className='ml-auto space-x-8 flex'>
              {user ?
                <>
                  <li><NavLink to={"/"} onClick={handleLogout}>Deconnecter</NavLink></li>
                </>
                :
                <>
                  <li><NavLink to={"/"}>Accueil</NavLink></li>
                  <li><NavLink to={"/register"}>S'inscrire</NavLink></li>
                  <li><NavLink to={"/login"}>Se connecter</NavLink></li>
                </>
              }      
            </ul>
        </div> 
    </>
  )
}

export default Menu