import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const AppRating = () => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [alreadyRated, setAlreadyRated] = useState(false);

    useEffect(() => {
        let sessionId = Cookies.get("session_id");
        if (!sessionId) {
            sessionId = Math.random().toString(36).substr(2, 9);
            Cookies.set("session_id", sessionId, { expires: 365 });
        }

        axios.get("http://localhost:8000/api/app-ratings/")
            .then(res => {
                const hasRated = res.data.some(rating => rating.session_id === sessionId);
                setAlreadyRated(hasRated);
            })
            .catch(err => console.log(err));

        axios.get("http://localhost:8000/api/app-ratings/average_rating/")
            .then(res => setAverageRating(res.data.average_rating))
            .catch(err => console.log(err));
    }, []);

    const handleRatingSubmit = (stars) => {
        if (alreadyRated) {
            alert("Vous avez déjà noté cette application.");
            return;
        }

        axios.post("http://localhost:8000/api/app-ratings/",
            { stars, session_id: Cookies.get("session_id") },
            { headers: { "X-CSRFToken": Cookies.get("csrftoken") } }
        )
            .then(() => {
                alert("Merci pour votre avis !");
                setAlreadyRated(true);
                setRating(stars);
            })
            .catch(err => console.log(err));
    };

    return (
        <>
            {!alreadyRated && (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <h2>Notez notre application</h2>

                    {/* ANIMATION DES ÉTOILES */}
                    <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                        {[...Array(5)].map((_, index) => {
                            const starValue = index + 1;
                            return (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.3, rotate: -10 }}  // Effet de zoom et rotation
                                    whileTap={{ scale: 0.9 }}  // Effet au clic
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <FaStar
                                        size={20}
                                        color={starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                        onMouseEnter={() => setHover(starValue)}
                                        onMouseLeave={() => setHover(null)}
                                        onClick={() => handleRatingSubmit(starValue)}
                                        style={{ cursor: "pointer", transition: "color 0.3s ease-in-out" }} // Transition fluide des couleurs
                                    />
                                </motion.div>
                            );
                        })}
                    </div>

                    <h3 style={{ marginTop: "20px" }}>Note moyenne : {averageRating.toFixed(1)} / 5</h3>
                </div>
            )}
        </>
    );
};

export default AppRating;
