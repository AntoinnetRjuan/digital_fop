import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getCsrfToken } from "./Utils";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const EditCorpsForm = () => {
    const { id: corpsId } = useParams();
    const [formData, setFormData] = useState({
        nom: "",
        numero: "",
        description: "",
        type: "",
        date_creation: "",
        status: "",
        fichier: null,
    });
    const navigate = useNavigate();
    const [typeCorps, setTypeCorps] = useState([]);

    // Charger les catégories de type de corps depuis l'API
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/typecorps/")
            .then((response) => setTypeCorps(response.data.results))
            .catch((error) =>
                console.error("Erreur lors de la récupération des types de corps :", error)
            );
    }, []);

    // Charger les données du corps spécifique pour modification
    useEffect(() => {
        if (corpsId) {
            axios
                .get(`http://localhost:8000/api/corps/${corpsId}/`)
                .then((response) => setFormData(response.data))
                .catch((error) =>
                    console.error("Erreur lors de la récupération du corps :", error)
                );
        }
    }, [corpsId]);

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Gérer les changements pour le fichier
    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            fichier: e.target.files[0],
        });
    };

    // Soumettre les modifications
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        for (const key in formData) {
            if (formData[key]) {
                data.append(key, formData[key]);
            }
        }

        try {
            const token = localStorage.getItem("access_token");
            await axios.put(`http://localhost:8000/api/corps/${corpsId}/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-CSRFToken": getCsrfToken(),
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Corps modifié avec succès !");
            navigate("/dashboard")
        } catch (error) {
            console.error("Erreur lors de la modification :", error.response?.data || error.message);
            toast.error("Une erreur est survenue lors de la modification.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md my-4">
            <h2 className="text-lg font-bold mb-4">Modifier un Corps</h2>

            {/* Catégories des corps professionnels */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Catégories des corps professionnels dans la fonction publique
                </label>
                <select
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    required
                >
                    <option value="">Choisir</option>
                    <option value="Administration Publique">Administration Publique</option>
                    <option value="Administration Judiciaire">Administration Judiciaire</option>
                    <option value="Administration Pénitentiaire">Administration Pénitentiaire</option>
                    <option value="Agriculture-Elevage-Pêche">Agriculture-Élevage - Pêche</option>
                    <option value="Chercheur enseignant et Enseignement chercheur">Chercheur enseignant et Enseignement chercheur</option>
                    <option value="Communication médiatisée">Communication médiatisée</option>
                    <option value="Diplomatie">Diplomatie</option>
                    <option value="Domaine-Topographie">Domaine-Topographie</option>
                    <option value="Environnement-Eaux-Forêts'">Environnement - Eaux et Forêts</option>
                    <option value="Éducation de base et Enseignement secondaire">Éducation de base et Enseignement secondaire</option>
                    <option value="Énergie, Mines et Ressources">Énergie, Mines et Ressources</option>
                    <option value="Économie, Finances et Plan">Économie, Finances et Plan</option>
                    <option value="Inspection de l'Etat">Inspection de l'État</option>
                    <option value="Forces Armées">Forces Armées</option>
                    <option value="Jeunesse et Sports">Jeunesse et Sports</option>
                    <option value="Météorologie">Météorologie</option>
                    <option value="Planification">Planification</option>
                    <option value="Police nationale">Police nationale</option>
                    <option value="Poste et Télécommunications">Poste et Télécommunications</option>
                    <option value="Travail et Lois Sociales">Travail et Lois Sociales</option>
                    <option value="Corps transversaux">Corps transversaux</option>
                    <option value="Travaux publics, Habitat et Aménagement">Travaux publics, Habitat et Aménagement</option>
                    <option value="Transports">Transports</option>
                    <option value="Santé Publique">Santé Publique</option>
                </select>
            </div>

            {/* Numéro */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Numéro</label>
                <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    required
                />
            </div>

            {/* Description */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    required
                />
            </div>

            {/* Type */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Type du corps</label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    required
                >
                    <option value="">Choisir</option>
                    {typeCorps.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.nom}
                        </option>
                    ))}
                </select>
            </div>

            {/* Date de création */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Date de création</label>
                <input
                    type="date"
                    name="date_creation"
                    value={formData.date_creation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    required
                />
            </div>

            {/* Statut */}
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Statut</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    required
                >
                    <option value="">Choisir</option>
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                </select>
            </div>

            {/* Fichier */}
            <div>
                <label className="block text-gray-700 font-medium mb-2">Fichier</label>
                <input
                    type="file"
                    name="fichier"
                    onChange={handleFileChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex justify-between mt-4">
                <button type="submit" className="bg-blue-600 text-white p-2 rounded">
                    Sauvegarder
                </button>
            </div>
        </form>
    );
};

export default EditCorpsForm;
