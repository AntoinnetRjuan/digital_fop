import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./AxiosConfig";
import { toast } from "react-toastify";
import { userContext } from "./Context";
import { Link } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPenToSquare, faTrash, faCashRegister, faForward, faBackward, faSquarePlus, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faReadme } from '@fortawesome/free-brands-svg-icons';
import Modal from "./Modal";

const Documents = ({ isAdmin }) => {
  const [data, setData] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [nextPage, setNextPage] = useState(true);
  const [previousPage, setPreviousPage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedModification, setSelectedModification] = useState(null);
  const [journaux, setJournaux] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedDomaine } = useContext(userContext);
  const navigate = useNavigate();

  const handleShowInfo = (modification) => {
    setSelectedModification(modification);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedModification(null);
  };

  const fetchDocuments = async (url) => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      setDocuments(response.data.results);

      if (!response.data.next) {
        setNextPage(false);
      } else {
        setNextPage(response.data.next);
      }

      if (url === "http://localhost:8000/api/documents/") {
        setPreviousPage(false);
      } else {
        setPreviousPage(response.data.previous);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des documents :", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchInitialDocuments = async () => {
      setLoading(true);
      try {
        const params = selectedDomaine ? { domaine: selectedDomaine } : {};
        const response = await axiosInstance.get("/api/documents/", { params });
        setDocuments(response.data.results);
        setNextPage(response.data.next);
        setPreviousPage(response.data.previous);
      } catch (error) {
        console.error("Erreur lors de la récupération des documents :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialDocuments();
  }, [selectedDomaine]);
  // useEffect(() => {
  //   if (selectedDomaine) {
  //     axiosInstance
  //       .get("/api/documents/", {
  //         params: { domaine: selectedDomaine },
  //       })
  //       .then((response) => setDocuments(response.data.results))
  //       .catch((error) => console.error("Erreur lors de la récupération des documents :", error));
  //   }
  // }, [selectedDomaine]);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8000/api/documents/")
  //     .then((response) => {
  //       setDocuments(response.data.results);
  //       setNextPage(response.data.next);
  //       setPreviousPage(response.data.previous);
  //     })
  //     .catch((error) => {
  //       console.error("Erreur lors de la récupération des documents :", error);
  //     });
  // }, []);

  const handleDelete = async (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.access;
    if (!token) {
      console.error("Token non trouvé. Veuillez vous connecter.");
      return;
    }
    try {
      await axiosInstance.delete(`/api/documents/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Document supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error.response || error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.access;
    const response = await axiosInstance.patch(
      `/api/documents/${id}/status/`,
      {
        status: newStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setData(
      data.map((doc) =>
        doc.id === id ? { ...doc, ...response.data } : doc
      )
    );
  };

  const handleEdit = (id) => {
    alert(`Redirigez vers la page de modification du document ID : ${id}`);
    navigate(`/edit/${id}`);
  };

  const handleView = async (fileUrl, fileType, documentId) => {
    if (fileType === "pdf") {
      window.open(fileUrl, "_blank");

      // Enregistrer la visite
      try {
        await axiosInstance.post(`/api/documents/${documentId}/visit/`);
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la visite :", error);
      }
    } else {
      alert("Ce fichier est disponible uniquement en téléchargement.");
    }
  };

  const handleSearch = async (criteria) => {
    try {
      const { searchBy, searchValue } = criteria;

      let params = {};
      if (searchBy === "journal") {
        params.dateJournal = searchValue.dateJournal;
        params.numeroJournal = searchValue.numeroJournal;
      } else if (searchBy === "date") {
        params.start_date = searchValue.startDate;
        params.end_date = searchValue.endDate;
      } else if (searchBy === "type") {
        params.type = searchValue.type;
        params.search = searchValue.text || "";
      } else {
        params[searchBy] = searchValue;
      }

      const response = await axiosInstance.get("/api/documents/", { params });
      setDocuments(response.data.results);
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
      setDocuments([]);
    }
  };

  const handleDownload = async (fileUrl, fileName, documentId) => {
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
      await axiosInstance.post(`/api/documents/${documentId}/telechargement/`);
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
      toast.error("Erreur lors du téléchargement du fichier.");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-transparent mt-9 px-4 sm:px-6 md:px-8">
        <div>
          <SearchBar onSearch={handleSearch} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-300 px-5 py-5">Liste des documents</h1>
        <div className="overflow-x-auto w-full max-w-6xl bg-white shadow-md rounded-lg">
          {showModal && selectedModification && (
            <Modal onClose={closeModal}>
              <h2 className="text-lg font-bold mb-4">Détails des modifications</h2>
              <p><strong>Modifié par :</strong> {selectedModification.user}</p>
              <p><strong>Date :</strong> {selectedModification.date}</p>
              <p><strong>Modifications :</strong> {selectedModification.details}</p>
            </Modal>
          )}
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-blue-900 text-yellow-300">
              <tr>
                <th className="py-3 px-2 sm:px-4">Dates</th>
                <th className="py-3 px-2 sm:px-4">Types</th>
                <th className="py-3 px-2 sm:px-4">Objets</th>
                <th className="py-3 px-2 sm:px-4">Status</th>
                <th className="py-3 px-2 sm:px-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <tr key={doc?.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-2 sm:px-4">{doc?.date}</td>
                    <td className="py-3 px-2 sm:px-4">{doc?.type}</td>
                    <td className="py-3 px-2 sm:px-4">{doc?.objet}</td>
                    <td className="py-3 px-2 sm:px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${doc?.status !== "En vigueur"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                          }`}
                      >
                        {doc?.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 sm:px-4">
                      {isAdmin ? (
                        <div className="flex space-x-2 sm:space-x-4">
                          {doc.pdf_file || doc.fichier ? (
                            <div className="flex-row">
                              <button
                                onClick={() => {
                                  doc.pdf_file
                                    ? handleView(doc.pdf_file, "pdf", doc.id)
                                    : handleView(doc.fichier, "pdf", doc.id);
                                }}
                                className="text-blue-800 hover:underline"
                              >
                                <FontAwesomeIcon icon={faReadme} />
                              </button>
                              <p>{doc.visits}</p>
                            </div>
                          ) : (
                            <span className="text-gray-500">Non disponible</span>
                          )}
                          <div className="flex-row">
                            <button
                              onClick={() =>
                                handleDownload(doc.pdf_file || doc.fichier, `document-${doc.id}.pdf`, doc.id)
                              }
                              className="text-gray-700 hover:underline"
                            >
                              <FontAwesomeIcon icon={faDownload} />
                            </button>
                            <p>{doc.telechargements}</p>
                          </div>
                          <button
                            onClick={() => handleEdit(doc?.id)}
                            className="text-green-500 hover:underline"
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                          <button
                            onClick={() => handleDelete(doc?.id)}
                            className="text-red-500 hover:underline"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                          <button
                            onClick={() => updateStatus(doc.id,
                              doc.status === "En vigueur" ? "Abrogé" : "En vigueur")}
                            className="text-yellow-500 hover:underline"
                          >
                            <FontAwesomeIcon icon={faCashRegister} />
                          </button>
                          {doc.last_modified_by && (
                            <button
                              onClick={() => handleShowInfo({
                                user: doc.last_modified_by,
                                date: doc.last_modified_at,
                                details: doc.modification_details,
                              })}
                              className="text-red-500 hover:underline"
                            >
                              <FontAwesomeIcon icon={faCircleInfo} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex space-x-2 sm:space-x-4">
                          {doc.pdf_file || doc.fichier ? (
                            <div className="flex-row">
                              <button
                                onClick={() => {
                                  doc.pdf_file
                                    ? handleView(doc.pdf_file, "pdf", doc.id)
                                    : handleView(doc.fichier, "pdf", doc.id);
                                }}
                                className="text-blue-800 hover:underline"
                              >
                                <FontAwesomeIcon icon={faReadme} />
                              </button>
                              <p>{doc.visits}</p>
                            </div>
                          ) : (
                            <span className="text-gray-500">Non disponible</span>
                          )}
                          <div className="flex-row">
                            <button
                              onClick={() =>
                                handleDownload(doc.pdf_file || doc.fichier, `document-${doc.id}.pdf`, doc.id)
                              }
                              className="text-gray-700 hover:underline"
                            >
                              <FontAwesomeIcon icon={faDownload} />
                            </button>
                            <p>{doc.telechargements}</p>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : loading ? (<tr className="flex justify-center ml-96 py-4">
                <Oval
                  visible={true}
                  height="80"
                  width="80"
                  color="#4f94a9"
                  ariaLabel="oval-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </tr>) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    Aucun résultat trouvé pour ces critères.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between mt-4 px-4 sm:px-6">
            <button
              onClick={() => previousPage && fetchDocuments(previousPage)}
              disabled={!previousPage}
              className={`px-2 sm:px-4 py-2 rounded-md text-sm sm:text-base ${previousPage ? "bg-blue-900 text-white" : "bg-gray-300 text-gray-500"}`}
            >
              <FontAwesomeIcon icon={faBackward} className="mr-1 sm:mr-2" />Précédente
            </button>
            <button
              onClick={() => nextPage && fetchDocuments(nextPage)}
              disabled={!nextPage}
              className={`px-2 sm:px-4 py-2 rounded-md text-sm sm:text-base ${nextPage ? "bg-blue-900 text-white" : "bg-gray-300 text-gray-500"}`}
            >
              Suivante<FontAwesomeIcon icon={faForward} className="ml-1 sm:ml-2" />
            </button>
          </div>
        </div>
        {isAdmin && (
          <div className="mt-5 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Link
              to={"/AjoutDoc"}
              className="bg-blue-900 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 text-center"
            >
              <FontAwesomeIcon icon={faSquarePlus} className="mr-2" />Ajouter un document
            </Link>
            <Link
              to={"/AjoutCorps"}
              className="bg-blue-900 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 text-center"
            >
              <FontAwesomeIcon icon={faSquarePlus} className="mr-2" />Ajouter un Corps
            </Link>
            <Link
              to={"/AjoutActus"}
              className="bg-blue-900 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 text-center"
            >
              <FontAwesomeIcon icon={faSquarePlus} className="mr-2" />Ajouter une Actualité
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Documents;