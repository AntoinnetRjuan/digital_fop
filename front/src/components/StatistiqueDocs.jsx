import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from 'react-chartjs-2';
import axiosInstance from './AxiosConfig';

// Enregistrer les composants de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DocumentStatsDropdown = () => {
    const documentTypes = [
        { value: 'constitution', label: 'Constitution' },
        { value: 'traités internationaux', label: 'Traités Internationaux' },
        { value: 'convention', label: 'Convention' },
        { value: 'lois organiques', label: 'Lois Organiques' },
        { value: 'lois ordinaires', label: 'Lois Ordinaires' },
        { value: 'ordonnances', label: 'Ordonnances' },
        { value: 'decrets', label: 'Décrets' },
        { value: 'arretes interministeriels', label: 'Arrêtés Interministériels' },
        { value: 'arretes', label: 'Arrêtés' },
        { value: 'circilaire', label: 'Circulaire' },
        { value: 'notes', label: 'Notes' },
    ];

    const corpsNom = [
        { value: "Administration Publique", label: 'Administration Publique' },
        { value: "Administration Judiciaire", label: 'Administration Judiciaire' },
        { value: "Administration Pénitentiaire", label: 'Administration Pénitentiaire' },
        { value: "Agriculture-Elevage - Pêche", label: 'Agriculture-Élevage - Pêche' },
        { value: "Chercheur enseignant et Enseignement chercheur", label: 'Chercheur enseignant et Enseignement chercheur' },
        { value: "Communication médiatisée", label: 'Communication médiatisée' },
        { value: "Diplomatie", label: 'Diplomatie' },
        { value: "Domaine-Topographie", label: 'Domaine-Topographie' },
        { value: "Environnement - Eaux et Forêts", label: 'Environnement - Eaux et Forêts' },
        { value: "Économie, Finances et Plan", label: 'Économie, Finances et Plan' },
        { value: "Inspection de l'Etat", label: 'Inspection de l\'État' },
        { value: "Forces Armées", label: 'Forces Armées' },
        { value: "Jeunesse et Sports", label: 'Jeunesse et Sport' },
        { value: "Météorologie", label: 'Météorologie' },
        { value: "Planification", label: 'Planification' },
        { value: "Police nationale", label: 'Police nationale' },
        { value: "Poste et Télécommunications", label: 'Poste et Télécommunications' },
        { value: "Travail et Lois Sociales", label: 'Travail et Lois Sociales' },
        { value: "Corps transversaux", label: 'Corps transversaux' },
        { value: "Travaux publics, Habitat et Aménagement", label: 'Travaux publics, Habitat et Aménagement' },
        { value: "Transports", label: 'Transports' },
        { value: "Santé Publique", label: 'Santé Publique' },
    ];

    const [selectedType, setSelectedType] = useState('');
    const [documentCount, setDocumentCount] = useState(null);
    const [totalDocuments, setTotalDocuments] = useState(null);
    const [selectedNom, setSelectedNom] = useState('');
    const [corpsCount, setCorpsCount] = useState(null);
    const [totalCorps, setTotalCorps] = useState(null);
    const [documentStats, setDocumentStats] = useState({ daily: 0, monthly: 0, yearly: 0 });
    const [corpsStats, setCorpsStats] = useState({ daily: 0, monthly: 0, yearly: 0 });
    const [selectedPeriod, setSelectedPeriod] = useState('daily');
    const [startDate, setStartDate] = useState('');
    const [mostVisitedDocuments, setMostVisitedDocuments] = useState([]);
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState(null);

    //recuperation des documents les plus visités
    useEffect(() => {
        const fetchMostVisitedDocuments = async () => {
            try {
                const response = await axiosInstance.get('/api/most-visited/');
                setMostVisitedDocuments(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des documents les plus visités :", error);
            }
        };

        fetchMostVisitedDocuments();
    }, []);
    // Fonction pour récupérer les statistiques
    const fetchStats = async () => {
        try {
            const params = {
                period: selectedPeriod,
            };

            // Ajouter start_date et end_date uniquement pour la période journalière
            if (selectedPeriod === 'daily') {
                params.start_date = startDate;
                params.end_date = endDate;
            }
            // Récupérer les statistiques des documents
            const documentResponse = await axios.get(`http://localhost:8000/api/documents-stats/`, { params });

            setDocumentStats({
                daily: documentResponse.data.daily_count || 0,
                monthly: documentResponse.data.monthly_count || 0,
                yearly: documentResponse.data.yearly_count || 0,
            });

            // Récupérer les statistiques des corps
            const corpsResponse = await axios.get(`http://localhost:8000/api/corps-stats1/`, { params });

            setCorpsStats({
                daily: corpsResponse.data.daily_count || 0,
                monthly: corpsResponse.data.monthly_count || 0,
                yearly: corpsResponse.data.yearly_count || 0,
            });

            setError(null); // Réinitialiser l'erreur
        } catch (error) {
            console.error("Erreur lors de la récupération des statistiques :", error);
            setError("Une erreur s'est produite lors de la récupération des statistiques.");
        }
    };

    // Récupérer les statistiques lorsque la période ou les dates changent
    useEffect(() => {
        fetchStats();
    }, [selectedPeriod, startDate, endDate]);

    // Récupérer le total des documents
    useEffect(() => {
        axios.get('http://localhost:8000/api/document-stats/')
            .then(response => setTotalDocuments(response.data.total_documents))
            .catch(error => console.error("Erreur lors de la récupération du total des documents :", error));
    }, []);

    // Récupérer le total des corps
    useEffect(() => {
        axios.get('http://localhost:8000/api/corps-stats/')
            .then(response => setTotalCorps(response.data.total_corps))
            .catch(error => console.error("Erreur lors de la récupération du total des corps:", error));
    }, []);

    // Gérer le changement de type de document
    const handleTypeChange = (event) => {
        const type = event.target.value;
        setSelectedType(type);
        axios.get(`http://localhost:8000/api/document-stats/`, { params: { type } })
            .then(response => setDocumentCount(response.data.count || 0))
            .catch(error => setDocumentCount(null));
    };

    // Gérer le changement de nom de corps
    const handleNomChange = (event) => {
        const nom = event.target.value;
        setSelectedNom(nom);
        axios.get(`http://localhost:8000/api/corps-stats/`, { params: { nom } })
            .then(response => setCorpsCount(response.data.count || 0))
            .catch(error => setCorpsCount(null));
    };

    const documentChartData = {
        labels: ['Journalier', 'Mensuel', 'Annuel'],
        datasets: [
            {
                label: 'Documents',
                data: [documentStats.daily, documentStats.monthly, documentStats.yearly],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Données pour le graphique des corps
    const corpsChartData = {
        labels: ['Journalier', 'Mensuel', 'Annuel'],
        datasets: [
            {
                label: 'Corps',
                data: [corpsStats.daily, corpsStats.monthly, corpsStats.yearly],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-center text-xl lg:text-2xl font-bold text-white mb-6">
                Reportage du nombre des textes existants dans la bibliothèque numérique
            </h1>
            {(totalDocuments !== null && totalCorps !== null) && (
                <p className="text-center text-lg text-gray-200 mb-6">
                    Total des textes en global : <span className="font-bold text-blue-500 text-4xl">{totalDocuments + totalCorps}</span>
                </p>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                    <strong>Erreur :</strong> {error}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Statistiques des Texte (Corps non inclus)</h2>
                    {totalDocuments !== null && (
                        <p className="text-gray-600 mb-4">
                            Total des documents : <span className="font-bold">{totalDocuments}</span>
                        </p>
                    )}
                    <label htmlFor="document-type" className="block text-sm font-medium text-gray-700 mb-2">
                        Sélectionnez un type de document :
                    </label>
                    <select
                        id="document-type"
                        value={selectedType}
                        onChange={handleTypeChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">-- Choisir un type --</option>
                        {documentTypes.map((type, index) => (
                            <option key={index} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                    {selectedType && (
                        <p className="mt-4 text-gray-700">
                            Nombre de documents pour <span className="font-bold">{selectedType}</span> :{' '}
                            <span className="text-xl font-semibold text-blue-600">
                                {documentCount !== null ? documentCount : 'Chargement...'}
                            </span>
                        </p>
                    )}
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Statistiques des Corps</h2>
                    {totalCorps !== null && (
                        <p className="text-gray-600 mb-4">
                            Total des corps : <span className="font-bold">{totalCorps}</span>
                        </p>
                    )}
                    <label htmlFor="corps-nom" className="block text-sm font-medium text-gray-700 mb-2">
                        Sélectionnez un nom de corps :
                    </label>
                    <select
                        id="corps-nom"
                        value={selectedNom}
                        onChange={handleNomChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">-- Choisir un type --</option>
                        {corpsNom.map((nom, index) => (
                            <option key={index} value={nom.value}>
                                {nom.label}
                            </option>
                        ))}
                    </select>
                    {selectedNom && (
                        <p className="mt-4 text-gray-700">
                            Nombre de textes pour <span className="font-bold">{selectedNom}</span> :{' '}
                            <span className="text-xl font-semibold text-blue-600">
                                {corpsCount !== null ? corpsCount : 'Chargement...'}
                            </span>
                        </p>
                    )}
                </div>
                {/* Nouvelle section pour les statistiques d'ajout */}
                <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Statistiques d'ajout</h2>
                    <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-2">
                        Sélectionnez une période :
                    </label>
                    <select
                        id="period"
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="daily">Journalier</option>
                        <option value="monthly">Mensuel</option>
                        <option value="yearly">Annuel</option>
                    </select>

                    {selectedPeriod === 'daily' && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Date de début :
                                </label>
                                <input
                                    type="date"
                                    id="start-date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Date de fin :
                                </label>
                                <input
                                    type="date"
                                    id="end-date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <h3 className="text-md font-semibold text-gray-700">Documents</h3>
                            <p className="text-gray-600">
                                Ajouts {selectedPeriod === 'daily' ? 'aujourd\'hui' : selectedPeriod === 'monthly' ? 'ce mois-ci' : 'cette année'} :{' '}
                                <span className="font-bold text-blue-600">
                                    {selectedPeriod === 'daily' ? documentStats.daily : selectedPeriod === 'monthly' ? documentStats.monthly : documentStats.yearly}
                                </span>
                            </p>
                            <div className="mt-4">
                                <Line data={documentChartData} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-md font-semibold text-gray-700">Corps</h3>
                            <p className="text-gray-600">
                                Ajouts {selectedPeriod === 'daily' ? 'aujourd\'hui' : selectedPeriod === 'monthly' ? 'ce mois-ci' : 'cette année'} :{' '}
                                <span className="font-bold text-blue-600">
                                    {selectedPeriod === 'daily' ? corpsStats.daily : selectedPeriod === 'monthly' ? corpsStats.monthly : corpsStats.yearly}
                                </span>
                            </p>
                            <div className="mt-4">
                                <Line data={corpsChartData} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Documents les plus visités:</h2>
                    <div className="overflow-x-auto w-full max-w-6xl bg-white shadow-md rounded-lg">
                        <table className="table-auto w-full text-left border-collapse">
                            <thead className="bg-blue-900 text-yellow-300">
                                <tr>
                                    <th className="py-3 px-2 sm:px-4">Types</th>
                                    <th className="py-3 px-2 sm:px-4">Numero</th>
                                    <th className="py-3 px-2 sm:px-4">Visites</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-900">
                                {mostVisitedDocuments.map((doc) => (
                                    <tr key={doc?.id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-2 sm:px-4">{doc?.type}</td>
                                        <td className="py-3 px-2 sm:px-4">{doc?.numero}</td>
                                        <td className="py-3 px-2 sm:px-4">{doc?.visits}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentStatsDropdown;