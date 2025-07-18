import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faFileAlt, faNewspaper, faChartBar, faStar, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FaStar } from "react-icons/fa";
import { userContext } from './Context';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


import Documents from './AfficherDocs';
import AfficheActus from './AfficheActus';
import AdminRemarks from './AdminRemarks';
import VisitStatistics from './VisitStatistics';
import DocumentStatsDropdown from './StatistiqueDocs';
import CorpsFilteredList from './CorpsFilteredList';

const Dashboard = () => {
  const { user } = useContext(userContext);
  const [showRemarks, setShowRemarks] = useState(false);
  const [totalStars, setTotalStars] = useState(0);

  // Refs pour chaque section
  const sections = {
    documents: useRef(null),
    status: useRef(null),
    actus: useRef(null),
    remarques: useRef(null),
    statistiques: useRef(null),
    etoiles: useRef(null)
  };

  const scrollTo = (sectionName) => {
    sections[sectionName]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/app-ratings/total_stars/");
        setTotalStars(res.data.total_stars);
      } catch (error) {
        console.error("Erreur lors de la récupération des étoiles :", error);
      }
    };
    fetchStars();
  }, []);

  const formatNumber = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
    return num;
  };

  const cards = [
    { label: "Documents", icon: faFileAlt, section: "documents" },
    { label: "Status", icon: faUsers, section: "status" },
    { label: "Actualités", icon: faNewspaper, section: "actus" },
    { label: "Remarques", icon: faComment, section: "remarques" },
    { label: "Statistiques", icon: faChartBar, section: "statistiques" },
    { label: "Étoiles", icon: faStar, section: "etoiles" },
  ];

  return (
    <>
      {/* Section principale de navigation + actions */}
      <section className="pt-10 pb-6 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-300">Tableau de bord administrateur</h1>
          <p className="text-gray-500 mt-1">Accès rapide aux fonctionnalités principales</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 sm:px-6 max-w-6xl mx-auto">
          {/* Liens vers sections (scrollTo) */}
          {cards.map(({ label, icon, section }) => (
            <motion.div
              key={section}
              className="bg-white shadow-md rounded-xl p-5 flex items-center space-x-4 cursor-pointer hover:bg-blue-50 transition"
              onClick={() => scrollTo(section)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 flex justify-center ml-2">
                <FontAwesomeIcon icon={icon} className="text-blue-600 text-2xl" />
              </div>
              <span className="text-lg font-medium text-gray-800">{label}</span>
            </motion.div>
          ))}

          {/* Cartes d'ajout */}
          {[
            { label: "Ajouter un document", to: "/AjoutDoc" },
            { label: "Ajouter un corps", to: "/AjoutCorps" },
            { label: "Ajouter une actualité", to: "/AjoutActus" }
          ].map(({ label, to }, index) => (
            <motion.div
              key={`ajout-${index}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white shadow-md rounded-xl p-5 flex items-center space-x-4 cursor-pointer hover:bg-blue-50 transition"
            >
              <Link to={to} className="flex items-center space-x-3 ml-2">
                <div className="w-10 flex justify-center">
                  <FontAwesomeIcon icon={faSquarePlus} className="text-blue-600 text-2xl" />
                </div>
                <span className="text-md font-medium text-gray-800">{label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>


      {/* Sections */}
      <section ref={sections.documents}>
        <Documents isAdmin={true} />
      </section>

      <section ref={sections.status} className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-300 text-center p-10">Status Particulier</h2>
        <CorpsFilteredList isAdmin={true} />
      </section>

      <section ref={sections.actus} className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-300 text-center">Actualités</h2>
        <AfficheActus isAdminE={true} />
      </section>

      <section ref={sections.remarques} className="flex flex-col items-center justify-center mt-10">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-gray-300">Voir les remarques des visiteurs</h2>
          <button
            onClick={() => setShowRemarks(!showRemarks)}
            aria-label="Afficher les remarques"
            className="focus:outline-none"
          >
            <FontAwesomeIcon icon={faComment} className="text-white h-10 w-10 hover:text-yellow-300" />
          </button>
        </div>
        {showRemarks && <AdminRemarks />}
      </section>

      <section ref={sections.statistiques} className="mt-10">
        <h2 className="text-center text-gray-300 text-3xl font-bold mb-4">Reporting</h2>
        <VisitStatistics />
      </section>

      <section className="mt-6">
        <DocumentStatsDropdown />
      </section>

      <section ref={sections.etoiles} className="rounded-xl bg-white shadow-lg mt-8 w-full max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Total des étoiles reçues :
          <span className="ml-2 text-yellow-400 font-bold inline-flex items-center space-x-2">
            {formatNumber(totalStars)}
            <motion.div
              whileHover={{ scale: 1.3, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaStar size={24} color="#ffc107" className="cursor-pointer transition-colors duration-300" />
            </motion.div>
          </span>
        </h2>
      </section>
    </>
  );
};

export default Dashboard;
