import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { toast } from 'react-toastify'
import { userContext } from './Context'
import  biblio from "../assets/logo.png"
import axios from 'axios'
const Menu = ({ onSelectDomaine }) => {
  const [domaines, setDomaines] = useState([])
  const [isMenuOpen, SetisMenuOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const toggleMenu = () => {
    SetisMenuOpen(!isMenuOpen)
  }
  useEffect(() => {
    axios.get('http://localhost:8000/api/domaines/')
      .then(response => setDomaines(response.data.results))
      .catch(error => console.error("Erreur est survenue lors du recuperation des domaines", error))
  }, [])

  const handleChangeDomaine = (e) => {
    const selectedDomaine = e.target.value;
    if (selectedDomaine) {
      onSelectDomaine(selectedDomaine); // Passe l'ID du domaine sélectionné au parent
    }
  };

  // const { user } = useSelector((state) => state.auth)
  const { user, setUser } = useContext(userContext)

  const handleLogout = () => {
    dispatch(logout())
    setUser('')
    dispatch(reset())
    navigate("/")
  }
  return (
    <>
      <nav className="fixed container top-28 w-3/4 mx-auto  rounded-lg left-0 right-0 bg-white shadow-xl p-2 z-50 ">
        <div className="flex items-center justify-between">
          <div className='gap-x-4 flex  text-black text-xl font-bold ml-8'>
            <div className='shrink-0'>
              <img src={biblio} alt='logo' className='size-6 ' />
            </div>
            <div>
              <h3 className='text-yellow-950'>Digital Library</h3>
            </div>

          </div>

          <div className="md:hidden">
            <button className="text-black" onClick={toggleMenu}>
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                className="w-6 h-6">


                <path d="M4 6h16M4 12h16M4 18h16"></path>

              </svg>

            </button>
          </div>
          <ul className="hidden md:flex space-x-6 mr-2 animate__animated animate__zoomInRight">
            {user?.refresh ? (
              <>
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
                    to={"/dashboard"}
                    className="text-gray-700 hover:text-blue-500 font-medium transition duration-200"
                  >
                    Dashboard
                  </Link>
                </li>
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
                  <select
                    name="domaine"
                    onChange={handleChangeDomaine}
                    className="text-gray-700 border rounded-lg px-3 py-1">
                    <option value="">Acces par theme</option>
                    {
                      domaines.map((dom) => (
                        <option key={dom.id} value={dom.id}>{dom.nom}</option>
                      ))
                    }
                  </select>
                </li>
                <li>
                  <Link
                    to={"/statuts"}
                    className="text-gray-700 hover:text-blue-500 font-medium transition duration-200"
                  >
                    Status Particuliers
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        {isMenuOpen && (
          <ul className="flex-col md:hidden  animate__animated animate__zoomInRight">
          {user?.refresh ? (
            <>
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
                  to={"/dashboard"}
                  className="text-gray-700 hover:text-blue-500 font-medium transition duration-200"
                >
                  Dashboard
                </Link>
              </li>
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
                <select
                  name="domaine"
                  onChange={handleChangeDomaine}
                  className="text-gray-700 border rounded-lg px-3 py-1">
                  <option value="">Acces par theme</option>
                  {
                    domaines.map((dom) => (
                      <option key={dom.id} value={dom.id}>{dom.nom}</option>
                    ))
                  }
                </select>
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
        )}
      </nav>
    </>
  )
}

export default Menu