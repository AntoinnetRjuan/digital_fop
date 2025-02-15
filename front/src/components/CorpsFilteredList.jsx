import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPenToSquare, faTrash, faCashRegister, faForward, faBackward, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faReadme } from '@fortawesome/free-brands-svg-icons';
import axiosInstance from './AxiosConfig';
import { toast } from 'react-toastify';

const CorpsFilteredList = ({ isAdmin }) => {
    const [corpsList, setCorpsList] = useState([]);
    const [selectedCorps, setSelectedCorps] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [corpsOptions, setCorpsOptions] = useState([]);
    const [typeCorps, setTypeCorps] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    // Charger les corps avec pagination
    useEffect(() => {
        fetchCorpsList(currentPage);
    }, [currentPage]);

    const fetchCorpsList = (page) => {
        axios
            .get(`http://localhost:8000/api/corps/?page=${page}`)
            .then((response) => {
                setCorpsList(response.data.results);

                setTotalPages(Math.ceil(response.data.count / 10));
            })
            .catch((error) => {
                console.error("Erreur lors du chargement des corps :", error);
                toast.error("Erreur lors du chargement des corps.");
            });
    };

    const handleChangeStatus = async (id, newStatus) => {
        const response = await axiosInstance.patch(
            `/api/corps/${id}/`,
            {
                status: newStatus,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            }
        );
        setCorpsList(
            corpsList.map((corps) => (corps.id === id ? response.data : corps))
        );
    };

    // Supprimer un corps
    const handleDelete = async (id) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.access;
        if (!token) {
            console.error("Token non trouvé. Veuillez vous connecter.");
            return;
        }
        try {
            await axiosInstance.delete(`/api/corps/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Document supprimé avec succès !");
        } catch (error) {
            console.error("Erreur lors de la suppression :", error.response || error);
        }
    };

    // Charger les options de la liste déroulante au démarrage
    useEffect(() => {
        axios.get('http://localhost:8000/api/corps-professionnels/')
            .then(response => {
                setCorpsOptions(response.data);
            })
            .catch(error => {
                console.error("Erreur lors du chargement des options de corps", error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8000/api/typecorps/')
            .then(response => setTypeCorps(response.data.results))
            .catch(error => console.error("Une erreur est survenue lors du récupération:", error));
    }, []);

    // Charger les corps filtrés quand le filtre change
    useEffect(() => {
        if (selectedCorps) {
            axios.get(`http://localhost:8000/api/corps-filter/?corps=${selectedCorps}`)
                .then(response => {
                    setCorpsList(response.data);
                })
                .catch(error => {
                    console.error("Erreur lors du chargement des corps filtrés", error);
                });
        }
    }, [selectedCorps]);

    const handleView = async (fileUrl, fileType, corpsId) => {
        if (!fileUrl.startsWith("http://")) {
            fileUrl = `http://localhost:8000${fileUrl}`;
        }

        if (fileType === "pdf") {
            window.open(fileUrl, "_blank");
            // Enregistrer la visite
            try {
                await axiosInstance.post(`/api/corps/${corpsId}/visit/`);
            } catch (error) {
                console.error("Erreur lors de l'enregistrement de la visite :", error);
            }
        } else {
            alert("Ce fichier est disponible uniquement en téléchargement.");
        }
    };

    const handleDownload = async (fileUrl, fileName, corpsId) => {
        try {
            const response = await axios.get(fileUrl, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName || "document.pdf");
            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            await axiosInstance.post(`/api/corps/${corpsId}/telechargement/`);
        } catch (error) {
            console.error("Erreur lors du téléchargement :", error);
            toast.error("Erreur lors du téléchargement du fichier.");
        }
    };

    const handleEdit = (id) => {
        alert(`Redirigez vers la page de modification du document ID : ${id}`);
        navigate(`/editCorps/${id}`);
    };

    return (
        <div className="overflow-x-auto w-full max-w-6xl bg-white shadow-md rounded-lg text-center mx-auto p-4">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Liste des Corps Professionnels</h1>

            {/* Liste déroulante pour sélectionner un corps */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par corps professionnel :</label>
                <select
                    id="corps"
                    value={selectedCorps}
                    onChange={(e) => setSelectedCorps(e.target.value)}
                    className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Sélectionner un corps --</option>
                    {Array.from(new Set(corpsOptions.map(corps => corps.nom))).map((nom, index) => (
                        <option key={index} value={nom}>
                            {nom}
                        </option>
                    ))}
                </select>
            </div>

            {/* Affichage de la liste filtrée */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Résultats :</h2>
                <div className="overflow-x-auto w-full max-w-6xl bg-white shadow-md rounded-lg">
                    {corpsList.length > 0 ? (
                        <>
                            <table className="table-auto w-full text-left border-collapse">
                                <thead className="bg-blue-900 text-yellow-300">
                                    <tr>
                                        <th className="py-3 px-2 sm:px-4">Dates</th>
                                        <th className="py-3 px-2 sm:px-4">Noms</th>
                                        <th className="py-3 px-2 sm:px-4">Description</th>
                                        <th className="py-3 px-2 sm:px-4">Status</th>
                                        <th className="py-3 px-2 sm:px-4">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {corpsList.map((corps) => (
                                        <tr key={corps?.id} className="border-b border-gray-200 hover:bg-gray-100">
                                            <td className="py-3 px-2 sm:px-4">{corps?.date_creation}</td>
                                            <td className="py-3 px-2 sm:px-4">{corps?.nom}</td>
                                            <td className="py-3 px-2 sm:px-4">{corps?.description}</td>
                                            <td className="py-3 px-2 sm:px-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${corps?.status !== "actif"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : "bg-green-100 text-green-600"
                                                        }`}
                                                >
                                                    {corps?.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 sm:px-4">
                                                {isAdmin ? (
                                                    <div className="flex space-x-2 sm:space-x-4">
                                                        <div className='flex-row'>
                                                            {corps.pdf_file || corps.fichier ? (
                                                                <button
                                                                    onClick={() => {
                                                                        corps.pdf_file
                                                                            ? handleView(corps.pdf_file, "pdf", corps.id)
                                                                            : handleView(corps.fichier, "pdf", corps.id);
                                                                    }}
                                                                    className="text-blue-800 hover:underline"
                                                                >
                                                                    <FontAwesomeIcon icon={faReadme} />
                                                                </button>
                                                            ) : (
                                                                <span className="text-gray-500">Non disponible</span>
                                                            )}
                                                            <p>{corps.visits}</p>
                                                        </div>
                                                        <div className='flex-row'>
                                                            <button
                                                                onClick={() =>
                                                                    handleDownload(corps.pdf_file || corps.fichier, `document-${corps.id}.pdf`, corps.id)
                                                                }
                                                                className="text-gray-700 hover:underline"
                                                            >
                                                                <FontAwesomeIcon icon={faDownload} />
                                                            </button>
                                                            <p>{corps.telechargements}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleEdit(corps?.id)}
                                                            className="text-green-500 hover:underline"
                                                        >
                                                            <FontAwesomeIcon icon={faPenToSquare} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(corps.id)}
                                                            className="text-red-500 hover:underline"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                        <button
                                                            className="text-yellow-500 hover:underline"
                                                            onClick={() =>
                                                                handleChangeStatus(
                                                                    corps.id,
                                                                    corps.status === "actif" ? "inactif" : "actif"
                                                                )
                                                            }
                                                        >
                                                            <FontAwesomeIcon icon={faCashRegister} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex space-x-2 sm:space-x-4">
                                                        <div className='flex-row-reverse'>
                                                            {corps.pdf_file || corps.fichier ? (
                                                                <button
                                                                    onClick={() => {
                                                                        corps.pdf_file
                                                                            ? handleView(corps.pdf_file, "pdf", corps.id)
                                                                            : handleView(corps.fichier, "pdf", corps.id);
                                                                    }}
                                                                    className="text-blue-800 hover:underline"
                                                                >
                                                                    <FontAwesomeIcon icon={faReadme} />
                                                                </button>
                                                            ) : (
                                                                <span className="text-gray-500">Non disponible</span>
                                                            )}
                                                            <p>{corps.visits}</p>
                                                        </div>

                                                        <div className='flex-row'>
                                                            <button
                                                                onClick={() =>
                                                                    handleDownload(corps.pdf_file || corps.fichier, `document-${corps.id}.pdf`, corps.id)
                                                                }
                                                                className="text-gray-700 hover:underline"
                                                            >
                                                                <FontAwesomeIcon icon={faDownload} />
                                                            </button>
                                                            <p>{corps.telechargements}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-between mt-4 px-2 sm:px-4">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-2 sm:px-4 py-2 rounded-md text-sm sm:text-base ${currentPage === 1 ? "bg-gray-300 text-gray-500" : "bg-blue-900 text-white"}`}
                                >
                                    <FontAwesomeIcon icon={faBackward} className="mr-1 sm:mr-2" /> Précédent
                                </button>
                                <span className="text-sm sm:text-base">Page {currentPage} sur {totalPages}</span>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`px-2 sm:px-4 py-2 rounded-md text-sm sm:text-base ${currentPage === totalPages ? "bg-gray-300 text-gray-500" : "bg-blue-900 text-white"}`}
                                >
                                    Suivant <FontAwesomeIcon icon={faForward} className="ml-1 sm:ml-2" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500">Aucun corps trouvé pour ce filtre.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CorpsFilteredList;