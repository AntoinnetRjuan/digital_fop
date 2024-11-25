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
    <form onSubmit={handleSubmit}>
      <select name="type" value={formData.type} onChange={handleChange} required>
        <option value="">Choisissez un type</option>
        <option value="constitution">Constitution</option>
        <option value="traité internationaux">Traité Internationaux</option>
        {/* Ajoutez plus d'options */}
      </select>
      <input type="text" name="objet" value={formData.objet} onChange={handleChange} required />
      <input type="text" name="reference" value={formData.reference} onChange={handleChange} required />
      <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      <select name="conseil" value={formData.conseil} onChange={handleChange}>
        <option value="aucun">Aucun</option>
        <option value="ministre">Ministre</option>
        <option value="gouvernement">Gouvernement</option>
      </select>
      <select name="domaine" value={formData.domaine} onChange={handleChange}>
        <option value="aucun">Aucun</option>
        <option value="juridique">Juridique</option>
        {/* Ajoutez plus d'options */}
      </select>
      <select name="acces" value={formData.acces} onChange={handleChange} required>
        <option value="telechargeable">Téléchargeable</option>
        <option value="non telechargeable">Non Téléchargeable</option>
      </select>
      <input type="file" name="fichier" onChange={handleFileChange} required />
      <button type="submit">Ajouter</button>
    </form>
  );
};

export default AjouterDocument;
