import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
          <Link
            to={"/"}
            onClick={handleLogout}
            className="text-gray-700 hover:text-blue-500 font-medium transition duration-200"
          >
            Déconnecter
          </Link>
        </li>
      </>
    ) : (
      <>
        {/* Ajout des nouvelles options */}
        <li>
          <Link
            to={"/"}
            className="text-gray-700 hover:text-blue-500 font-medium transition duration-200"
          >
            Accueil
          </Link>
        </li>
        <li>
          <Link
            to={"/theme"}
            className="text-gray-700 hover:text-blue-500 font-medium transition duration-200"
          >
            Accès par thème
          </Link>
        </li>
        <li>
          <Link
            to={"/statuts"}
            className="text-gray-700 hover:text-blue-500 font-medium transition duration-200"
          >
            Statuts
          </Link>
        </li>
        
        <li>
          <Link
            to={"/login"}
            className="text-gray-700 hover:text-blue-500 font-medium transition duration-200"
          >
            Se connecter
          </Link>
        </li>
      </>
    )}
  </ul>
</div>

    </>
  )
}

export default Menu