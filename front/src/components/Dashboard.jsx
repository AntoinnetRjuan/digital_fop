import React from 'react';
import AjouterDocument from './AddDocs';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import Documents from './AfficherDocs';

function Dashboard() {
    return(
        <>
            <h1 className='mt-20 text-center'>Bienvenue, Super Admin</h1>
            <Link to={"/AjoutDoc"} className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200'>Ajouter un document</Link>
            <Documents isAdmin={true}/>
        </>
    ) ;
}

export default Dashboard;
