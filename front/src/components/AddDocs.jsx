import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "./AxiosConfig";
import { ThreeDots } from "react-loader-spinner"
import { useNavigate } from "react-router-dom";

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
    inclusJournal: false,
    dateJournal: "",
    numeroJournal: "",
    pageJournal: "",
  });


  const [domaines, setDomaines] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    // Récupérer les domaines depuis l'API
    axiosInstance.get("/api/domaines/")
      .then(response => setDomaines(response.data.results))
      .catch(error => console.error("Erreur lors de la récupération des domaines :", error));
  }, []);
  const handleInclusJournalChange = (e) => {
    const inclus = e.target.checked;
    setFormData((prevData) => ({
      ...prevData,
      inclusJournal: inclus,
      ...(inclus ? {} : { dateJournal: "", numeroJournal: "", pageJournal: "" }), // Réinitialiser les champs si décoché
    }));
  };

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
      if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    });

    setLoading(true)
    try {
      await axiosInstance
        .post("/api/documents/", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      toast.success("Document ajouté avec succès !");
      navigate("/dashboard")
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error.response || error);
      toast.error("Erreur lors de l'ajout du document.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent mt-40">
      <div className="flex flex-wrap bg-white rounded-lg shadow-lg overflow-hidden md:w-1/2 w-full lg:w-3/4 animate__animated animate__pulse">
        <div className="hidden md:block w-1/2 bg-cover bg-center"
          style={{
            backgroundImage: "url('../../public/ajout.jpg')", width: "50%",
            height: "auto", backgroundSize: "cover",
            backgroundPosition: "center",
          }}>

        </div>
        <div className="w-full md:w-1/2 p-6">
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
                <option value="traités internationaux">Traités Internationaux</option>
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
                placeholder="Entrez la référence (ex: xxxx-xxx)"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Date (sortie du document)
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
            {/* Inclus dans le Journal Officiel */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Inclus dans le Journal Officiel ?
              </label>
              <input
                type="checkbox"
                name="inclusJournal"
                checked={formData.inclusJournal}
                onChange={handleInclusJournalChange}
                className="mr-2"
              />
            </div>

            {formData.inclusJournal && (
              <>
                {/* Date du Journal Officiel */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Date du Journal Officiel
                  </label>
                  <input
                    type="date"
                    name="dateJournal"
                    value={formData.dateJournal}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Numéro du Journal Officiel */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Numéro du Journal Officiel
                  </label>
                  <input
                    type="text"
                    name="numeroJournal"
                    value={formData.numeroJournal}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Entrez le numéro du Journal Officiel"
                  />
                </div>

                {/* Page du Journal Officiel */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Page du Journal Officiel
                  </label>
                  <input
                    type="text"
                    name="pageJournal"
                    value={formData.pageJournal}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Entrez la page du Journal Officiel"
                  />
                </div>
              </>
            )}


            {/* Bouton Ajouter */}
            <button
              type="submit"
              className="bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              {loading ? (<ThreeDots
                visible={true}
                height="40"
                width="40"
                color="#ffffff"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />) : "Ajouter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AjouterDocument;
