import React, { useState, useEffect } from 'react';
import Documents from './AfficherDocs';
import { useContext } from 'react';
import { userContext } from './Context';
import AfficheActus from './AfficheActus';
import AdminRemarks from './AdminRemarks';
import VisitStatistics from './VisitStatistics';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import DocumentStatsDropdown from './StatistiqueDocs';
import CorpsFilteredList from './CorpsFilteredList';
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from 'axios';

function Dashboard() {
    const { user } = useContext(userContext);
    const [showRemarks, setShowRemarks] = useState(false);
    const [totalStars, setTotalStars] = useState(0);

    const toggleRemarks = () => {
        setShowRemarks(!showRemarks);
    };
    useEffect(() => {
        axios.get("http://localhost:8000/api/app-ratings/total_stars/")
            .then(res => setTotalStars(res.data.total_stars))
            .catch(err => console.log(err));
    }, []);
    const formatNumber = (num) => {
        if (num >= 1_000_000) {
          return (num / 1_000_000).toFixed(1) + "M";
        } else if (num >= 1_000) {
          return (num / 1_000).toFixed(1) + "k";
        }
        return num;
    };
    return (
        <>
            <div className='mt-40'>
                <Documents isAdmin={true} />
            </div>
            <div>
                <h1 className="text-2xl font-semibold text-gray-400 px-5 py-5 flex flex-col items-center justify-center">Status Particulier</h1>
                <CorpsFilteredList isAdmin={true} />
            </div>
            <div>
                <h1 className="text-2xl font-semibold text-gray-400 px-5 py-5 flex flex-col items-center justify-center">Actualités</h1>
                <AfficheActus isAdminE={true} />
            </div>
            <div className="flex flex-col items-center justify-center mt-8">
                <div className="flex items-center">
                    <h1 className="text-2xl font-semibold text-gray-400">Voir les remarques des visiteurs</h1>
                    <button onClick={toggleRemarks} className="ml-4">
                        <FontAwesomeIcon icon={faComment} className='text-white h-12 w-12' />
                    </button>
                </div>
                {showRemarks && <AdminRemarks />}
            </div>
            <div className="dashboard">
                <h1 className="text-center text-white text-3xl font-bold mb-4">Reporting</h1>
                <VisitStatistics />
            </div>
            <div className='mt-6'>
                <DocumentStatsDropdown />
            </div>
            <div className='rounded-xl bg-white shadow-lg mt-6 w-1/2 mx-auto'>
                <h1 className="text-2xl font-semibold text-gray-950 px-5 py-5 flex flex-col items-center justify-center">Total des étoiles reçues : <span className='text-2xl font-bold text-yellow-300'>{formatNumber(totalStars) }<motion.div
                    whileHover={{ scale: 1.3, rotate: -10 }}  // Effet de zoom et rotation
                    whileTap={{ scale: 0.9 }}  // Effet au clic
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <FaStar
                        size={20}
                        color="#ffc107"
                        style={{ cursor: "pointer", transition: "color 0.3s ease-in-out" }} // Transition fluide des couleurs
                    />
                </motion.div></span></h1>
            </div>
        </>
    );
}

export default Dashboard;