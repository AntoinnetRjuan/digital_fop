import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
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

    useEffect(() => {
        axios.get('http://localhost:8000/api/corps-stats/')
            .then(response => setTotalCorps(response.data.total_corps))
            .catch(error => console.error("Erreur lors de la récupération du total des corps:", error));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8000/api/document-stats/')
            .then(response => setTotalDocuments(response.data.total_documents))
            .catch(error => console.error("Erreur lors de la récupération du total des documents :", error));
    }, []);

    const handleTypeChange = (event) => {
        const type = event.target.value;
        setSelectedType(type);
        axios.get(`http://localhost:8000/api/document-stats/`, { params: { type } })
            .then(response => setDocumentCount(response.data.count || 0))
            .catch(error => setDocumentCount(null));
    };

    const handleNomChange = (event) => {
        const nom = event.target.value;
        setSelectedNom(nom);
        axios.get(`http://localhost:8000/api/corps-stats/`, { params: { nom } })
            .then(response => setCorpsCount(response.data.count || 0))
            .catch(error => setCorpsCount(null));
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-center text-xl lg:text-2xl font-bold text-white mb-6">
                Reportage du nombre des textes existants dans la bibliothèque numérique
            </h1>
            {(totalDocuments !== null && totalCorps !== null) && (
                <p className="text-center text-lg text-gray-600 mb-6">
                    Total des textes en global : <span className="font-bold">{totalDocuments + totalCorps}</span>
                </p>
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
            </div>
        </div>
    );
};

export default DocumentStatsDropdown;
