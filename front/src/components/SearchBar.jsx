import React, { useState } from "react";
import axios from "axios";

const SearchBar = ({ onSearch }) => {
    const [searchBy, setSearchBy] = useState("objet"); // Critère de recherche
    const [searchValue, setSearchValue] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [suggestions, setSuggestions] = useState([]); // Liste des suggestions
    const [showSuggestions, setShowSuggestions] = useState(false); // Affichage des suggestions

    // Fonction pour récupérer les suggestions depuis le backend
    const fetchSuggestions = async (value) => {
        if (value.trim() === "") {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8000/api/suggestions/`, {
                params: {
                    searchBy,
                    query: value,
                },
            });
            setSuggestions(response.data); // Stocker les suggestions dans l'état
            setShowSuggestions(true);
        } catch (error) {
            console.error("Erreur lors de la récupération des suggestions :", error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const critere = {
            searchBy,
            searchValue: searchBy === "date" ? { startDate, endDate } : searchValue,
        };
        setShowSuggestions(false);
        onSearch(critere);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchValue(suggestion); 
        setShowSuggestions(false);
    };

    return (
        <div className="flex flex-col items-center w-full p-4 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
            <h1 className="text-xl font-semibold text-gray-800 mb-4">Formulaire de recherche</h1>
            <form className="flex flex-col md:flex-row items-center w-full gap-4" onSubmit={handleSearch}>
                {/* Dropdown pour choisir le critère de recherche */}
                <select
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchBy}
                    onChange={(e) => setSearchBy(e.target.value)}
                >
                    <option value="objet">Objet</option>
                    <option value="type">Type</option>
                    <option value="date">Date (Début et Fin)</option>
                    <option value="numero">Numéro</option>
                    <option value="journal">Journal Officiel</option>
                </select>

                {/* Champ de saisie pour le texte ou les dates */}
                {searchBy === "date" ? (
                    <div className="flex gap-2 items-center">
                        <input
                            type="date"
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="Date de début"
                        />
                        <span>à</span>
                        <input
                            type="date"
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="Date de fin"
                        />
                    </div>
                ) : (
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                fetchSuggestions(e.target.value); // Appeler les suggestions en temps réel
                            }}
                            placeholder={`Recherche par ${searchBy}`}
                        />
                        {/* Liste déroulante des suggestions */}
                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 z-10 shadow-md">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className="p-2 hover:bg-blue-100 cursor-pointer"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Bouton de recherche */}
                <button
                    type="submit"
                    className="bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Rechercher
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
