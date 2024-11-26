import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";

const Documents = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/documents/")
      .then(response => {
        setDocuments(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des documents :", error);
      });
  }, []);
  const handleSearch = (criteria) => {
    console.log("Critères de recherche :", criteria);
    // Effectuez votre recherche ici (par exemple, filtrer les données ou effectuer un appel API)
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
                      {documents.map((doc) => (
                          <tr
                              key={doc.id}
                              className="border-b border-gray-200 hover:bg-gray-100"
                          >
                              <td className="py-3 px-6">{doc.date}</td>
                              <td className="py-3 px-6">{doc.type}</td>
                              <td className="py-3 px-6">{doc.objet}</td>
                              <td className="py-3 px-6">
                                  <span
                                      className={`px-3 py-1 rounded-full text-xs ${
                                          doc.status === "In progress"
                                          ? "bg-yellow-100 text-yellow-600"
                                          : "bg-green-100 text-green-600"
                                      }`}
                                  >
                                      {doc.status}
                                  </span>
                              </td>
                              <td className="py-3 px-6">
                                  {doc.telechargeable ? (
                                      <button className="text-blue-500 hover:underline">
                                          Télécharger
                                      </button>
                                    ) : (
                                      <span className="text-gray-500">N/A</span>
                                    )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
    </div>
  );
};

export default Documents;
