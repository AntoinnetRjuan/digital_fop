import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
    const [searchBy, setSearchBy] = useState("objet"); // Critère de recherche
    const [searchValue, setSearchValue] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        const critere = {
            searchBy,
            searchValue: searchBy === "date" ? { startDate, endDate } : searchValue,
        };
        onSearch(critere); // Envoyer les critères de recherche au parent
    };

    return (
        <div className="flex flex-col items-center w-full p-4 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
            <h1 className="text-xl font-semibold text-gray-800 mb-4">Recherche</h1>
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
                    <option value="reference">Référence</option>
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
                    <input
                        type="text"
                        className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={`Recherche par ${searchBy}`}
                    />
                )}

                {/* Bouton de recherche */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Rechercher
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
