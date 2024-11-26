import React from 'react';
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
import Login from './components/Login';
import Dashboard from './components/Dashboard'
import Accueil from './components/Accueil';
import Register from './components/Register';
import Menu from './components/Menu';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './components/ResetPassword';

const App = () => {
   
    return (
        <>
          
           <ToastContainer/>
           <Router>
           <Menu/>
                <Routes>  
                    <Route path="/" element={<Accueil/>} />
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/resetpassword' element={<ResetPassword/>}/>
                    <Route path='/dashboard' element={<Dashboard/>}/>
                </Routes>
           </Router>       
        </>
    );
};

export default App;
