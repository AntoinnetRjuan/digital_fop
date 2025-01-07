import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const RemarkForm = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/api/remarks/", { email, message }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            toast.success("Remarque envoyée avec succès !");
            setEmail("");
            setMessage("");
        } catch (error) {
            console.error("Erreur lors de l'envoi de la remarque :", error);
            toast.error("Erreur lors de l'envoi de la remarque.");
        }
    };

    return (
        <div className="flex flex-col items-center w-full p-6 rounded-lg max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold text-yellow-900 mb-6">Envoyer une remarque</h1>
            <form className="flex flex-row w-full gap-6" onSubmit={handleSubmit}>
                <input
                    type="email"
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email"
                    required
                />
                <textarea
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Votre remarque"
                    rows="5"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-900 text-yellow-300 py-3 px-6 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Envoyer
                </button>
            </form>
        </div>
    );
};

export default RemarkForm;
