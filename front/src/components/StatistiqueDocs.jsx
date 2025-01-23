import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

    const [selectedType, setSelectedType] = useState('');
    const [documentCount, setDocumentCount] = useState(null);
    const [totalDocuments, setTotalDocuments] = useState(null);

    // Récupérer le nombre total de documents lors du montage du composant
    useEffect(() => {
        axios
            .get('http://localhost:8000/api/document-stats/')
            .then(response => {
                setTotalDocuments(response.data.total_documents);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération du total des documents :", error);
            });
    }, []);

    // Gérer le changement de type et récupérer le nombre de documents pour le type sélectionné
    const handleTypeChange = (event) => {
        const type = event.target.value;
        setSelectedType(type);

        axios
            .get(`http://localhost:8000/api/document-stats/`, { params: { type } })
            .then(response => {
                setDocumentCount(response.data.count || 0);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des statistiques :", error);
                setDocumentCount(null);
            });
    };

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Statistiques des Documents</h1>
                {totalDocuments !== null && (
                    <p className="text-lg text-gray-600 mb-4">
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
                    <div className="mt-4">
                        <p className="text-gray-700">
                            Nombre de documents pour <span className="font-bold">{selectedType}</span> :
                        </p>
                        <p className="text-xl font-semibold text-blue-600">
                            {documentCount !== null ? documentCount : 'Chargement...'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentStatsDropdown;
