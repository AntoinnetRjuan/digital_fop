import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const VisitStatistics = () => {
    const [totalVisits, setTotalVisits] = useState([]);
    const [uniqueVisitors, setUniqueVisitors] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/visit-statistics/", {
                params: { start_date: startDate, end_date: endDate },
            });

            console.log("Données reçues :", response.data);

            setTotalVisits(response.data.total_visits || []);
            setUniqueVisitors(response.data.unique_visitors || []);
        } catch (error) {
            console.error("Erreur lors de la récupération des statistiques :", error);
            setTotalVisits([]);
            setUniqueVisitors([]);
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        fetchStatistics();
    };

    const data = {
        labels: totalVisits.map((visit) => visit.day), // Les jours
        datasets: [
            {
                label: "Visites totales",
                data: totalVisits.map((visit) => visit.count), // Les valeurs
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                tension: 0.4,
            },
            {
                label: "Visiteurs uniques",
                data: uniqueVisitors.map((visit) => visit.count),
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Dates",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Nombre",
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="p-4 m-11 bg-white shadow-lg rounded-lg text-center">
            <h1 className="text-2xl font-semibold mb-4"><FontAwesomeIcon icon={faChartLine} className="px-3"/>Statistiques de visites</h1>
            <form onSubmit={handleFilter} className=" mb-4 mx-auto">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border rounded-md"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border rounded-md"
                />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
                    Filtrer
                </button>
            </form>
            {totalVisits.length > 0 || uniqueVisitors.length > 0 ? (
                <>
                    <div>
                        <div>
                            Nombre total de visits:{totalVisits.map((visit) => visit.count)[0]}
                        </div>
                        <div>
                            Nombre de Visiteur unique:{uniqueVisitors.map((visit) => visit.count)[0]}
                        </div>
                    </div>
                    <Line data={data} options={options} />
                </>
            ) : (
                <p>Aucune donnée disponible pour la période sélectionnée.</p>
            )}
        </div>
    );
};

export default VisitStatistics;
