import React from 'react';
import AjouterDocument from './AddDocs';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import Documents from './AfficherDocs';
import { useContext } from 'react';
import { userContext } from './Context';
function Dashboard() {
    const {user} = useContext(userContext)
    return(
        <>
            <h1 className='mt-20 text-center'>Bienvenue,Admin</h1>
            <Link to={"/AjoutDoc"} className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200'>Ajouter un document</Link>
            <Link to={"/AjoutCorps"} className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200'>Ajouter un Corps</Link>
            <Documents isAdmin={true}/>
        </>
    ) ;
}

export default Dashboard;
