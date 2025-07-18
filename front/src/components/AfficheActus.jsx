import React, { useEffect, useState } from 'react';
import axiosInstance from './AxiosConfig';
import { toast } from 'react-toastify';
import gov from "../assets/gov.svg";
import ministre from "../assets/ministre.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash,faLandmark, faUsers } from '@fortawesome/free-solid-svg-icons';



const Modal = ({ show, onClose, actu, onUpdate, onDelete, isAdmin }) => {
    const [updatedActu, setUpdatedActu] = useState(actu);

    const handleUpdate = () => {
        const updatedData = {
            ...updatedActu,
            conseil: actu.conseil  // Ajoutez le champ conseil si nécessaire
        };
        console.log('Données envoyées:', updatedData);
        axiosInstance
            .put(`/api/actualites/${actu.id}/`, updatedData)
            .then((response) => {
                toast.success('Actualité mise à jour avec succès');
                onUpdate(response.data);
                onClose();
            })
            .catch((error) => {
                console.error('Erreur lors de la mise à jour de l\'actualité:', error.response);
                toast.error('Erreur lors de la mise à jour de l\'actualité');
            });
    };

    const handleDelete = () => {
        axiosInstance
            .delete(`/api/actualites/${actu.id}/`)
            .then(() => {
                toast.success('Actualité supprimée avec succès');
                onDelete(actu.id);
                onClose();
            })
            .catch(() => {
                toast.error('Erreur lors de la suppression de l\'actualité');
            });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-2/3 max-h-screen overflow-y-auto text-center">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{actu.titre}</h2>
                    <button
                        className="text-red-600 font-bold text-xl"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
                <h2>{actu.conseil}</h2>
                <p className="text-gray-600 italic">Date : {actu.date}</p>
                <p className="text-gray-800 font-semibold mb-4">Lieu : {actu.lieu}</p>
                <div className="text-gray-700">
                    <p>{actu.texte}</p>
                </div>

                {isAdmin && (
                    <div className="mt-4">
                        <select
                                name="conseil"
                                value={updatedActu.conseil}
                                onChange={(e) => setUpdatedActu({ ...updatedActu, conseil: e.target.value })}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="CONSEIL DES MINISTRES">Conseil des ministres</option>
                                <option value="CONSEIL DU GOUVERNEMENT">Conseil du Gouvernement</option>
                            </select>
                        <input
                            type="text"
                            value={updatedActu.titre}
                            onChange={(e) => setUpdatedActu({ ...updatedActu, titre: e.target.value })}
                            className="border p-2 w-full mb-2"
                            placeholder="Modifier le titre"
                        />
                        <input
                            type="date"
                            value={updatedActu.date}
                            onChange={(e) => setUpdatedActu({ ...updatedActu, date: e.target.value })}
                            className="border p-2 w-full mb-2"
                            placeholder="Modifier le date"
                        />
                        <input
                            type="text"
                            value={updatedActu.lieu}
                            onChange={(e) => setUpdatedActu({ ...updatedActu, lieu: e.target.value })}
                            className="border p-2 w-full mb-2"
                            placeholder="Modifier le lieu"
                        />
                        <textarea
                            value={updatedActu.texte}
                            onChange={(e) => setUpdatedActu({ ...updatedActu, texte: e.target.value })}
                            className="border p-2 w-full mb-2"
                            placeholder="Modifier le texte"
                        />
                        <button
                            onClick={handleUpdate}
                            className="bg-green-500 text-white p-2 rounded-md mr-2"
                        >
                            <FontAwesomeIcon icon={faPenToSquare} /> Modifier
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white p-2 rounded-md"
                        >
                            <FontAwesomeIcon icon={faTrash} />Supprimer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const AfficheActus = ({ isAdminE }) => {
    const [actualite, setActualite] = useState([]);
    const [selectedActu, setSelectedActu] = useState(null);

    useEffect(() => {
        axiosInstance.get('/api/actualites/')
            .then(response => {
                setActualite(response.data.results);
            })
            .catch(() => {
                toast.error('Erreur lors de la récupération des actualités.');
            });
    }, []);

    const conseilMinistre = actualite.filter((actus) => actus.conseil === 'CONSEIL DES MINISTRES');
    const conseilGouvernement = actualite.filter((actus) => actus.conseil === 'CONSEIL DU GOUVERNEMENT');

    const openModal = (id) => {
        axiosInstance
            .get(`/api/actualites/${id}`)
            .then((response) => {
                setSelectedActu(response.data);
            })
            .catch(() => {
                toast.error('Erreur lors de la récupération de l\'actualité');
            });
    };

    const closeModal = () => {
        setSelectedActu(null);
    };

    const updateActu = (updatedActu) => {
        setActualite(actualite.map((actu) => (actu.id === updatedActu.id ? updatedActu : actu)));
    };

    const deleteActu = (id) => {
        setActualite(actualite.filter((actu) => actu.id !== id));
    };

    return (
        <div className="flex items-center justify-center">
            <div className=" bg-white rounded-lg p-4 mx-4 md:mx-10 w-2/3">
                <div className="flex flex-col md:flex-row gap-4">

                    <div className="w-full md:w-1/2">
                        <div className="flex items-center justify-center">
                            <span>
                                <FontAwesomeIcon icon={faLandmark} className='h-10 py-3 text-green-700'/>
                            </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-black text-center">
                            Conseil du Gouvernement
                        </h3>
                        {conseilGouvernement.length > 0 ? (
                            conseilGouvernement.map((actus) => (
                                <div
                                    key={actus.id}
                                    className="bg-gray-100 p-4 rounded-md text-gray-900 mb-4 cursor-pointer"
                                    onClick={() => openModal(actus.id)}
                                >
                                    <p>{actus.titre}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Aucune actualité disponible.</p>
                        )}
                    </div>

                    <div className="w-full md:w-1/2">
                        <div className="flex justify-center">
                            <span className="icons2 c2">
                                <FontAwesomeIcon icon={faUsers} className='h-10 py-3 text-red-600'/>
                            </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-black text-center">
                            Conseil des Ministres
                        </h3>
                        {conseilMinistre.length > 0 ? (
                            conseilMinistre.map((actus) => (
                                <div
                                    key={actus.id}
                                    className="bg-gray-100 p-4 rounded-md text-gray-900 mb-4 cursor-pointer"
                                    onClick={() => openModal(actus.id)}
                                >
                                    <p>{actus.titre}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Aucune actualité disponible.</p>
                        )}
                    </div>
                </div>

                {selectedActu && (
                    <Modal
                        show={!!selectedActu}
                        onClose={closeModal}
                        actu={selectedActu}
                        onUpdate={updateActu}
                        onDelete={deleteActu}
                        isAdmin={isAdminE}
                    />
                )}
            </div>
        </div>

    );
};

export default AfficheActus;
