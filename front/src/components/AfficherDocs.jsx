import React, { useEffect, useState } from "react";
import axios from "axios";

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

  return (
    <div className="text-center">
      <h1>Liste des documents</h1>
      <table className="place-items-center">
        <thead className="bg-slate-200 rounded-xl">
            <tr>
              <th>Dates</th>
              <th>Types</th>
              <th>Objets</th>
            </tr>
        </thead>
        <tbody>
            {documents.map(doc => (
              <tr key={doc.id}>
                <td className="p-9">{doc.date}</td>
                <td className="p-9">{doc.type}</td>
                <td className="p-9">{doc.objet}</td>
                {doc.telechargeable && (<td>telecharger</td>)}  
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Documents;
