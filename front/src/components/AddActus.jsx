import { useEffect, useState } from 'react'
import axiosInstance from './AxiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddActus = () => {
    const [formData, setFormData] = useState({
        conseil: "",
        titre: "",
        date: "",
        lieu: "",
        texte: "",
    })
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();


        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        try {
            axiosInstance.post("/api/actualites/", data);
            toast.success("ajout de l'actualité est effectué avec succes")
            navigate("/dashboard")
        } catch (error) {
            //console.log("Erreur:", error.response || error);
            toast.error("un erreur est survenue lors de l'ajout de l'actualité")
        }
    }
    return (
        <div className='flex items-center justify-center min-h-screen bg-transparent mt-5'>
            <div className="flex flex-wrap bg-white rounded-lg shadow-lg overflow-hidden md:w-1/2 w-full lg:w-3/4 mt-40 animate__animated animate__pulse">
                <div className="hidden md:block w-1/2 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('../../public/actualite.png')", width: "50%",
                        height: "auto", backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}>

                </div>
                <div className='w-full md:w-1/2 p-6'>
                    <h2 className="text-lg font-bold mb-4 text-center">Ajouter un Document</h2>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Type de conseil
                            </label>
                            <select
                                name="conseil"
                                value={formData.conseil}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="CONSEIL DES MINISTRES">Conseil des ministres</option>
                                <option value="CONSEIL DE GOUVERNEMENT">Conseil du Gouvernement</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Titre
                            </label>
                            <input
                                type="text"
                                name="titre"
                                value={formData.titre}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder="Entrez le titre de l'actualité"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Lieu
                            </label>
                            <input
                                type="text"
                                name="lieu"
                                value={formData.lieu}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder="Entrez le lieu"
                            />
                        </div>
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
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Texte
                            </label>
                            <textarea
                                name="texte"
                                value={formData.texte}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder="Saisissez le texte"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                        >
                            Ajouter
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddActus