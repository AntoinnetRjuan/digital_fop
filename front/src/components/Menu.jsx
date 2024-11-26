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
       <div className="container mx-auto flex items-center fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-50">
  <ul className="ml-auto space-x-6 flex items-center">
    {user ? (
      <>
        <li>
          <NavLink
            to={"/"}
            onClick={handleLogout}
            className="text-gray-700 hover:text-blue-500 font-medium transition duration-200"
          >
            Déconnecter
          </NavLink>
        </li>
      </>
    ) : (
      <>
        {/* Ajout des nouvelles options */}
        <li>
          <NavLink
            to={"/"}
            className="text-gray-700 hover:text-blue-500 font-medium transition duration-200"
          >
            Accueil
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/theme"}
            className="text-gray-700 hover:text-blue-500 font-medium transition duration-200"
          >
            Accès par thème
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/statuts"}
            className="text-gray-700 hover:text-blue-500 font-medium transition duration-200"
          >
            Statuts particuliers
          </NavLink>
        </li>
        
        <li>
          <NavLink
            to={"/login"}
            className="text-gray-700 hover:text-blue-500 font-medium transition duration-200"
          >
            Se connecter
          </NavLink>
        </li>
      </>
    )}
  </ul>
</div>

    </>
  )
}

export default Menu