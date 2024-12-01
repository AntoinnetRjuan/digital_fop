import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";

const Documents = ({ isAdmin, doc }) => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/api/documents/")
      .then(response => {
        setDocuments(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des documents :", error);
      });
  }, []);

  const handleDelete = async (id) => {
    const user = JSON.parse(localStorage.getItem("user")); // Récupérer le token depuis le stockage local
    const token = user?.access;
    if (!token) {
      console.error("Token non trouvé. Veuillez vous connecter.");
      return;
    }
    console.log("Token utilisé pour DELETE :", token); //
    try {
      await axios.delete(`http://localhost:8000/api/documents/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter le token dans l'en-tête
        },
      });
      console.log("Document supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error.response || error);
    }
  };

  const handleEdit = (id) => {
    alert(`Redirigez vers la page de modification du document ID : ${id}`);
    // Ajoutez ici la logique pour rediriger vers une page de modification
    navigate(`/edit/${id}`);
  };

  const handleSearch = async (criteria) => {
    try {
      const { searchBy, searchValue } = criteria;
  
      let params = {};
      if (searchBy === "date") {
        params.start_date = searchValue.startDate;
        params.end_date = searchValue.endDate;
      } else {
        params[searchBy] = searchValue; // Inclut 'reference' comme clé
      }
  
      const response = await axios.get("http://localhost:8000/api/documents/", {
        params,
      });
      setDocuments(response.data);
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
      setDocuments([]);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div>
        <SearchBar onSearch={handleSearch} />
      </div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Liste des documents</h1>
      <div className="overflow-x-auto w-full max-w-4xl bg-white shadow-md rounded-lg">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-slate-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6">Dates</th>
              <th className="py-3 px-6">Types</th>
              <th className="py-3 px-6">Objets</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6">{doc.date}</td>
                  <td className="py-3 px-6">{doc.type}</td>
                  <td className="py-3 px-6">{doc.objet}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${doc.status === "In progress"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                        }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    {isAdmin ? (
                      <>
                        <button
                          onClick={() => handleEdit(doc.id)}
                          className="text-green-500 hover:underline mr-2"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-500 hover:underline"
                        >
                          Supprimer
                        </button>
                      </>
                    ) : doc.acces === "telechargeable" ? (
                      <button className="text-blue-500 hover:underline">
                        Télécharger
                      </button>
                    ) : (
                      <span className="text-gray-500">Non téléchargeable</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  Aucun résultat trouvé pour ces critères.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Documents;
