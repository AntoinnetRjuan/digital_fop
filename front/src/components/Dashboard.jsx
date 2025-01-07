import React, { useState } from 'react';
import Documents from './AfficherDocs';
import { useContext } from 'react';
import { userContext } from './Context';
import AfficheActus from './AfficheActus';
import AdminRemarks from './AdminRemarks';
import { CgComment } from "react-icons/cg";

function Dashboard() {
    const { user } = useContext(userContext);
    const [showRemarks, setShowRemarks] = useState(false);

    const toggleRemarks = () => {
        setShowRemarks(!showRemarks);
    };

    return (
        <>
            <div className='mt-40'>
                <Documents isAdmin={true} />
            </div>
            <div>
                <h1 className="text-2xl font-semibold text-gray-400 mt-8 flex flex-col items-center justify-center">Actualités</h1>
                <AfficheActus isAdminE={true}/>
            </div>
            <div className="flex flex-col items-center justify-center mt-8">
                <div className="flex items-center">
                    <h1 className="text-2xl font-semibold text-gray-400">Voir les remarques des visiteurs</h1>
                    <button onClick={toggleRemarks} className="ml-4">
                        <CgComment className="text-gray-400 h-24 w-24" />
                    </button>
                </div>
                {showRemarks && <AdminRemarks />}
            </div>
        </>
    );
}

export default Dashboard;
