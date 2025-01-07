import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "./AxiosConfig";
import { FaReply } from "react-icons/fa";

const AdminRemarks = () => {
    const [remarks, setRemarks] = useState([]);
    const [response, setResponse] = useState("");
    const [selectedRemark, setSelectedRemark] = useState(null);

    useEffect(() => {
        axiosInstance.get('/api/remarks/')
        .then(response => {
            setRemarks(response.data.results);
        })
        .catch(() => {
            toast.error('Erreur lors de la récupération des remarques.');
        });
    }, []);

    const handleResponseChange = (e) => {
        setResponse(e.target.value);
    };

    const handleSendResponse = (remark) => {
        axiosInstance.post('/api/send-response/', {
            email: remark.email,
            response: response
        })
        .then(() => {
            toast.success('Réponse envoyée avec succès.');
            setResponse("");
            setSelectedRemark(null);
        })
        .catch(() => {
            toast.error('Erreur lors de l\'envoi de la réponse.');
        });
    };

    return (
        <div className="flex flex-col items-center w-full p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Remarques des visiteurs</h1>
            <div className="w-full">
                {remarks.length > 0 ? (
                    remarks.map((remark) => (
                        <div key={remark.id} className="p-4 mb-4 border border-gray-300 rounded-md bg-gray-50">
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-medium"><strong>Email:</strong> {remark.email}</p>
                                <FaReply
                                    className="text-blue-500 cursor-pointer"
                                    onClick={() => setSelectedRemark(selectedRemark === remark.id ? null : remark.id)}
                                />
                            </div>
                            <p className="mt-2"><strong>Message:</strong> {remark.message}</p>
                            <p className="mt-2 text-sm text-gray-600"><strong>Date:</strong> {new Date(remark.created_at).toLocaleString()}</p>
                            {selectedRemark === remark.id && (
                                <div className="mt-4">
                                    <textarea
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Votre réponse"
                                        value={response}
                                        onChange={handleResponseChange}
                                    />
                                    <button
                                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                                        onClick={() => handleSendResponse(remark)}
                                    >
                                        Envoyer la réponse
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">Aucune remarque trouvée.</p>
                )}
            </div>
        </div>
    );
};

export default AdminRemarks;
