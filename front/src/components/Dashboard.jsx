import React, { useState, useEffect } from 'react';
import Documents from './AfficherDocs';
import { useContext } from 'react';
import { userContext } from './Context';
import AfficheActus from './AfficheActus';
import AdminRemarks from './AdminRemarks';
import VisitStatistics from './VisitStatistics';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

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
                <AfficheActus isAdminE={true} />
            </div>
            <div className="flex flex-col items-center justify-center mt-8">
                <div className="flex items-center">
                    <h1 className="text-2xl font-semibold text-gray-400">Voir les remarques des visiteurs</h1>
                    <button onClick={toggleRemarks} className="ml-4">
                        <FontAwesomeIcon icon={faComment} className='text-white h-12 w-12'/>
                    </button>
                </div>
                {showRemarks && <AdminRemarks />}
            </div>
            <div className="dashboard">
                <h1 className="text-center text-white text-3xl font-bold mb-4">Reporting</h1>
                <VisitStatistics/>
            </div>
        </>
    );
}

export default Dashboard;