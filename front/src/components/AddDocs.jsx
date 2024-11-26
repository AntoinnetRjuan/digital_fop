import React, { useState } from "react";
import axios from "axios";

const AjouterDocument = () => {
  const [formData, setFormData] = useState({
    type: "",
    objet: "",
    reference: "",
    date: "",
    conseil: "",
    domaine: "",
    acces: "",
    fichier: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, fichier: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    axios.post("http://localhost:8000/api/documents/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(response => {
        alert("Document ajouté avec succès !");
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout :", error);
      });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 mb-6">
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
            {/* Ajoutez plus d'options */}
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
            Référence
          </label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
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
            <option value="juridique">Juridique</option>
            {/* Ajoutez plus d'options */}
          </select>
        </div>

        {/* Accès */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Accès
          </label>
          <select
            name="acces"
            value={formData.acces}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="telechargeable">Téléchargeable</option>
            <option value="non telechargeable">Non Téléchargeable</option>
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
