// import React, { useState , useEffect} from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {useDispatch, useSelector} from 'react-redux'
// import { login, reset } from '../features/auth/authSlice'
// import { toast } from 'react-toastify';

// function Login() {
//     const [formData, setFormData] = useState({
//         "email":"",
//         "password":"",
//     })

//     const { email, password } = formData

//     const dispatch = useDispatch()
//     const navigate = useNavigate()
//     const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

//     const handleChange = (e) => {
//         setFormData((prev) => ({
//             ...prev,
//             [e.target.name]:e.target.value
//         })
//         )
//     }

//     const handleSubmit = (e) => {
//         e.preventDefault()
//             const userData = {
//                 email, 
//                 password, 
//             }
//             dispatch(login(userData))
//     }
//     useEffect(()=>{
//         if (isError) {
//             toast.error(message)
//         }

//         if (isSuccess || user) {
//             navigate("/dashboard")
//             toast.success("Bienvenue dans le dashboard admin")
//         }
//         dispatch(reset())
//     }, [isError, isSuccess, user, message, navigate])
//     return (
//         <div>
//             <h1>Connexion</h1>
//             <form className="flex flex-col space-y-4">
//                 <input
//                     type="text"
//                     placeholder="Email"
//                     name='email'
//                     value={email}
//                     onChange={handleChange}
//                 />
//                 <input
//                     type="password"
//                     placeholder="Mot de passe"
//                     value={password}
//                     onChange={handleChange}
//                     name='password'
//                 />
//                 <button type="submit" onClick={handleSubmit}>Se connecter</button>
//             </form>
//             <Link to={"/resetpassword"}>oublier mot de passe?</Link>
//         </div>
//     );
// }

// export default Login;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  // Mise à jour des champs
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Gestion de la connexion
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Étape 1 : Authentification via Redux (ou directement via Axios)
      const userData = { email, password };
      dispatch(login(userData)); // Votre action Redux

      // Étape 2 : Vérifiez si l'utilisateur est superutilisateur
      const loginResponse = await axios.post("http://localhost:8000/api/token/", {
        username: email,
        password,
      });

      localStorage.setItem("accessToken", loginResponse.data.access);
      localStorage.setItem("refreshToken", loginResponse.data.refresh);

      const userResponse = await axios.get("http://localhost:8000/api/check-superuser/", {
        headers: {
          Authorization: `Bearer ${loginResponse.data.access}`,
        },
      });

      if (userResponse.data.is_superuser) {
        window.location.href = "http://localhost:8000/admin/";
      } else {
        navigate("/dashboard");
        toast.success("Bienvenue dans le dashboard admin");
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
      toast.error("Identifiants incorrects ou problème de connexion.");
    }
  };

  // Gestion des effets après tentative de connexion via Redux
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate("/dashboard");
      toast.success("Bienvenue dans le dashboard admin");
    }

    dispatch(reset());
  }, [isError, isSuccess, user, message, navigate, dispatch]);

  return (
    <div>
      <h1>Connexion</h1>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          name="password"
          value={password}
          onChange={handleChange}
        />
        <button type="submit">Se connecter</button>
      </form>
      <Link to="/resetpassword">oublier mot de passe?</Link>
    </div>
  );
}

export default Login;
