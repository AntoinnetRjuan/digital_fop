import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
import Login from './components/Login';
import Dashboard from './components/Dashboard'
import Accueil from './components/Accueil';
import Menu from './components/Menu';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './components/ResetPassword';
import axios from 'axios';
import AjouterDocument from './components/AddDocs';
import EditDocument from './components/EditDoc';
import { userContext } from './components/Context';
import CorpsForm from './components/AjoutCorps';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPasswordConfirmPage from './components/ResetPasswordConfirmPage';
import Header from './components/Header';
import Footer from './components/Footer';
import AddActus from './components/AddActus';
import RemarkForm from "./components/RemarkForm";
import AdminRemarks from "./components/AdminRemarks";
import Documents from './components/AfficherDocs';
import AnimatedCard from './components/AnimatedCard';
import CorpsFilteredList from './components/CorpsFilteredList';
import EditCorpsForm from './components/EditCorpsForm';
axios.defaults.withCredentials = true;

const App = () => {
    const { user, setUser, setSelectedDomaine } = useContext(userContext)
    const [token] = useState(JSON.parse(localStorage.getItem('user')))
    useEffect(() => {
        if (token) {
            setUser(token)
        }
    }, [])
    

    return (
        <>
            <div className='bg-gray-900'>
                <Header />
                <ToastContainer />
                <Router>
                    <Menu user={user} onSelectDomaine={setSelectedDomaine} />
                    <Routes>
                        <Route path="/" element={<Accueil />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/resetpassword' element={<ResetPassword />} />
                        <Route path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirmPage />} />
                        <Route path='/dashboard' element={<ProtectedRoute isAuthenticated={user.refresh}><Dashboard /></ProtectedRoute>} />
                        <Route path='/AjoutDoc' element={<ProtectedRoute isAuthenticated={user.refresh}><AjouterDocument /></ProtectedRoute>} />
                        <Route path="/edit/:id" element={<ProtectedRoute isAuthenticated={user.refresh}><EditDocument /></ProtectedRoute>} />
                        <Route path="/editCorps/:id" element={<ProtectedRoute isAuthenticated={user.refresh}><EditCorpsForm/></ProtectedRoute>} />
                        <Route path='/AjoutCorps' element={<ProtectedRoute isAuthenticated={user.refresh}><CorpsForm /></ProtectedRoute>} />
                        <Route path='/AjoutActus' element={<ProtectedRoute isAuthenticated={user.refresh}><AddActus /></ProtectedRoute>} />
                        <Route path="/remarks" element={<RemarkForm />} />
                        <Route path='/AfficherDoc' element={<Documents />} />
                        <Route path='/status' element={<CorpsFilteredList />} />
                        <Route path="/admin/remarks" element={<AdminRemarks />} />
                        <Route path='*' element={<Accueil />} />
                    </Routes>
                </Router>
                <Footer />
            </div>

        </>
    );
};

export default App;
