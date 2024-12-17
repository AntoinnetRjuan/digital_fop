import React, { useState,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "./AxiosConfig";

const AjouterDocument = () => {
  const [formData, setFormData] = useState({
    type: "",
    objet: "",
    numero: "",
    date: "",
    conseil: "",
    domaine: "",
    status: "",
    fichier: null,
  });

  const [domaines, setDomaines] = useState([]);
  useEffect(() => {
    // Récupérer les domaines depuis l'API
    axios.get("http://localhost:8000/api/domaines/")
      .then(response => setDomaines(response.data.results))
      .catch(error => console.error("Erreur lors de la récupération des domaines :", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, fichier: e.target.files[0] });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
  
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    
    await axiosInstance
      .post("/api/documents/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success("Document ajouté avec succès !");
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout :", error.response || error);
      });
  };
  

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 mt-16">
      <h2 className="text-lg font-bold mb-4 text-center">Ajouter un Document</h2>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        {/* Type */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Type de document
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choisissez un type</option>
            <option value="constitution">Constitution</option>
            <option value="traité internationaux">Traité Internationaux</option>
            <option value="convention">Convention</option>
            <option value="lois organiques">Lois Organiques</option>
            <option value="lois ordinaires">Lois Ordinaires</option>
            <option value="ordonnances">Ordonnance</option>
            <option value="decrets">Décrets</option>
            <option value="arretes interministeriels">Arrêtés Interministériels</option>
            <option value="arretes">Arrêtés</option>
            <option value="circilaire">Circulaire</option>
            <option value="notes">Notes</option>
          </select>
        </div>

        {/* Objet */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Objet
          </label>
          <input
            type="text"
            name="objet"
            value={formData.objet}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez l'objet du document"
          />
        </div>

        {/* Référence */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Numéro
          </label>
          <input
            type="text"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez la référence"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Conseil */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Conseil
          </label>
          <select
            name="conseil"
            value={formData.conseil}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="aucun">Aucun</option>
            <option value="ministre">Ministre</option>
            <option value="gouvernement">Gouvernement</option>
          </select>
        </div>

        {/* Domaine */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Domaine
          </label>
          <select
            name="domaine"
            value={formData.domaine}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="aucun">Aucun</option>
            {domaines.map((domaine) => (
              <option key={domaine.id} value={domaine.id}>
                {domaine.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Accès */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="en_vigueur">En vigueur</option>
            <option value="abroge">Abrogé</option>
          </select>
        </div>

        {/* Fichier */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Fichier
          </label>
          <input
            type="file"
            name="fichier"
            onChange={handleFileChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bouton Ajouter */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default AjouterDocument;
