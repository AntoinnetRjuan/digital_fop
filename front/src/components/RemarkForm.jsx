import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

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
        <div className="flex flex-col items-center w-full p-3 rounded-lg max-w-4xl mx-auto">
            <h1 className="text-base sm:text-lg font-semibold text-yellow-900 mb-3 text-center">
                Envoyer une remarque a propos de l'application
            </h1>
            <form
                className="flex flex-col w-full gap-2"
                onSubmit={handleSubmit}
            >
                {/* Email Input */}
                <input
                    type="email"
                    className="w-full p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email"
                    required
                />
                {/* Message Textarea */}
                <textarea
                    className="w-full p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Votre remarque"
                    rows="2"
                    required
                />
                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-900 text-yellow-300 py-1.5 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center text-sm"
                >
                    Envoyer
                    <FontAwesomeIcon icon={faPaperPlane} className="ml-2" />
                </button>
            </form>
        </div>
    );
};

export default RemarkForm;