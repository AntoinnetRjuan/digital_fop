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
    const [selectedCorps, setSelectedCorps] = useState(''); // Corps sélectionné
    const [currentPage, setCurrentPage] = useState(1);
    const [corpsOptions, setCorpsOptions] = useState([]); // Options pour la liste déroulante
    const [typeCorps, setTypeCorps] = useState([])
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
                setTotalPages(Math.ceil(response.data.count / 10)); // Basé sur une page de 10 éléments
            })
            .catch((error) => {
                console.error("Erreur lors du chargement des corps :", error);
                toast.error("Erreur lors du chargement des corps.");
            });
    };

    // Changer le statut d'un corps
    // const handleChangeStatus = (id, newStatus) => {
    //     axios
    //         .patch(`http://localhost:8000/api/corps/${id}/update_status/`, { status: newStatus }, {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    //             },
    //         })
    //         .then(() => {
    //             toast.success("Statut mis à jour !");
    //             fetchCorpsList(currentPage);
    //         })
    //         .catch((error) => {
    //             console.error("Erreur lors de la mise à jour du statut :", error);
    //             toast.error("Erreur lors de la mise à jour du statut.");
    //         });
    // };

    const handleChangeStatus = async (id, newStatus)=> {
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
            .catch(error => console.error("Une erreur est survenue lors du récupération:", error))
    }, [])

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
    const handleView = (fileUrl, fileType) => {
        if (!fileUrl.startsWith("http://")) {
            // Si l'URL est relative, ajoutez la base du backend
            fileUrl = `http://localhost:8000${fileUrl}`;
        }

        if (fileType === "pdf") {
            window.open(fileUrl, "_blank"); // Ouvrir le fichier dans un nouvel onglet
        } else {
            alert("Ce fichier est disponible uniquement en téléchargement.");
        }
    };
    const handleDownload = async (fileUrl, fileName) => {
        try {
            const response = await axios.get(fileUrl, {
                responseType: "blob", // Important : récupère le fichier en tant que blob
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName || "document.pdf");
            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
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
        <div className="overflow-x-auto w-full max-w-6xl bg-white shadow-md rounded-lg text-center mx-auto">
            <h1>Liste des Corps Professionnels</h1>

            {/* Liste déroulante pour sélectionner un corps */}
            <label>Filtrer par corps professionnel :</label>
            <select
                id="corps"
                value={selectedCorps}
                onChange={(e) => setSelectedCorps(e.target.value)}
            >
                <option value="">-- Sélectionner un corps --</option>
                {corpsOptions.map((corps) => (
                    <option key={corps.id} value={corps.nom}>
                        {corps.nom}
                    </option>
                ))}
            </select>

            {/* Affichage de la liste filtrée */}
            <div>
                <h2>Résultats :</h2>
                {corpsList.length > 0 ? (
                    <>
                        <table className="table-auto w-full text-left border-collapse">
                            <thead className="bg-blue-900 text-yellow-300">
                                <tr>
                                    <th className="py-3 px-4 sm:px-6">Dates</th>
                                    <th className="py-3 px-4 sm:px-6">Types</th>
                                    <th className="py-3 px-4 sm:px-6">Description</th>
                                    <th className="py-3 px-4 sm:px-6">Status</th>
                                    <th className="py-3 px-4 sm:px-6">Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {corpsList.map((corps) => (
                                    <tr key={corps?.id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-4 sm:px-6">{corps?.date_creation}</td>
                                        {typeCorps.map((type) => (
                                            <td className="py-3 px-4 sm:px-6" key={type.id}>{type?.nom}</td>
                                        ))
                                        }
                                        <td className="py-3 px-4 sm:px-6">{corps?.description}</td>
                                        <td className="py-3 px-4 sm:px-6">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs ${corps?.status !== "actif"
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : "bg-green-100 text-green-600"
                                                    }`}
                                            >
                                                {corps?.status}
                                            </span>
                                        </td>
                                        {isAdmin ? (
                                            <>
                                                {corps.pdf_file || corps.fichier ? (
                                                    <button
                                                        onClick={() => {
                                                            corps.pdf_file
                                                                ? handleView(corps.pdf_file, "pdf")
                                                                : handleView(corps.fichier, "pdf");
                                                        }}
                                                        className="text-blue-800 hover:underline"
                                                    >
                                                        <FontAwesomeIcon icon={faReadme} />
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-500">Non disponible</span>
                                                )}
                                                <button
                                                    onClick={() => handleEdit(corps?.id)}
                                                    className="text-green-500 hover:underline mr-2 px-9"
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
                                                    className="text-yellow-500 hover:underline px-14"
                                                    onClick={() =>
                                                        handleChangeStatus(
                                                            corps.id,
                                                            corps.status === "actif" ? "inactif" : "actif"
                                                        )
                                                    }
                                                >
                                                    <FontAwesomeIcon icon={faCashRegister} className="px-3" />status
                                                </button>
                                            </>
                                        ) : (
                                            <div className="space-x-5">
                                                {corps.pdf_file || corps.fichier ? (
                                                    <button
                                                        onClick={() => {
                                                            corps.pdf_file
                                                                ? handleView(corps.pdf_file, "pdf")
                                                                : handleView(corps.fichier, "pdf");
                                                        }}
                                                        className="text-blue-800 hover:underline"
                                                    >
                                                        <FontAwesomeIcon icon={faReadme} />
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-500">Non disponible</span>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        handleDownload(corps.pdf_file || corps.fichier, `document-${corps.id}.pdf`)
                                                    }
                                                    className="text-gray-700 hover:underline"
                                                >
                                                    <FontAwesomeIcon icon={faDownload} className="icon" />
                                                </button>
                                            </div>
                                        )}
                                    </tr>

                                ))}

                            </tbody>

                        </table>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <FontAwesomeIcon icon={faBackward} className='px-2' /> Précédent
                            </button>
                            <span>Page {currentPage} sur {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Suivant<FontAwesomeIcon icon={faForward} className='px-2' />
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Aucun corps trouvé pour ce filtre.</p>
                )}
            </div>
        </div>
    );
};

export default CorpsFilteredList;