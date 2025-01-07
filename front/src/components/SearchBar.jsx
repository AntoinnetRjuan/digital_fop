import React, { useState } from "react";
import axios from "axios";

const SearchBar = ({ onSearch }) => {
    const [searchBy, setSearchBy] = useState("objet");
    const [searchValue, setSearchValue] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const types = [
        { value: "", label: "Choisissez un type" },
        { value: "constitution", label: "Constitution" },
        { value: "traité internationaux", label: "Traité Internationaux" },
        { value: "convention", label: "Convention" },
        { value: "lois organiques", label: "Lois Organiques" },
        { value: "lois ordinaires", label: "Lois Ordinaires" },
        { value: "ordonnances", label: "Ordonnance" },
        { value: "decrets", label: "Décrets" },
        { value: "arretes interministeriels", label: "Arrêtés Interministériels" },
        { value: "arretes", label: "Arrêtés" },
        { value: "circilaire", label: "Circulaire" },
        { value: "notes", label: "Notes" },
    ];

    const fetchSuggestions = async (value) => {
        if (value.trim() === "") {
            setSuggestions([]);
            return;
        }

        try {
            const params = searchBy === "type" 
            ? { searchBy, query: value, type: selectedType }
            : { searchBy, query: value };
            const response = await axios.get(`http://localhost:8000/api/suggestions/`, { params });
            setSuggestions(response.data);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Erreur lors de la récupération des suggestions :", error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const critere = {
            searchBy,
            searchValue:
                searchBy === "date"
                    ? { startDate, endDate }
                    : searchBy === "type"
                    ? { type: selectedType, text: searchValue }
                    : searchValue,
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
                ) : searchBy === "type" ? (
                    <div className="flex flex-col md:flex-row gap-4 items-center w-full">
                        <select
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            {types.map((type, index) => (
                                <option key={index} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                if (e.target.value.trim()) {
                                    fetchSuggestions(e.target.value);
                                } else {
                                    setSuggestions([]);
                                }
                            }}
                            placeholder="Entrez une référence ou un complément de recherche"
                        />
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
                ) : (
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                fetchSuggestions(e.target.value);
                            }}
                            placeholder={`Recherche par ${searchBy}`}
                        />
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

                <button
                    type="submit"
                    className="bg-blue-800 text-yellow-300 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Rechercher
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
