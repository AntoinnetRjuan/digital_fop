import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Configuration Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VisitStatistics = () => {
    const [data, setData] = useState({ totalVisits: [], uniqueVisitors: [] });
    const [filters, setFilters] = useState({ startDate: "", endDate: "" });

    useEffect(() => { fetchStatistics(); }, []);

    const fetchStatistics = async () => {
        try {
            const { data: stats } = await axios.get("http://localhost:8000/api/visit-statistics/", {
                params: { start_date: filters.startDate, end_date: filters.endDate },
            });
            setData({
                totalVisits: stats.total_visits || [],
                uniqueVisitors: stats.unique_visitors || [],
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des statistiques :", error);
            setData({ totalVisits: [], uniqueVisitors: [] });
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const chartData = {
        labels: data.totalVisits.map((visit) => visit.day),
        datasets: [
            {
                label: "Visites totales",
                data: data.totalVisits.map((visit) => visit.count),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                tension: 0.4,
            },
            {
                label: "Visiteurs uniques",
                data: data.uniqueVisitors.map((visit) => visit.count),
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: { legend: { position: "top" } },
        scales: {
            x: { title: { display: true, text: "Dates" } },
            y: { title: { display: true, text: "Nombre" }, beginAtZero: true },
        },
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-semibold mb-6">
                <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                Statistiques de visites
            </h1>
            <form
                onSubmit={(e) => { e.preventDefault(); fetchStatistics(); }}
                className="mb-6 flex justify-center gap-4"
            >
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="text-lg p-2 border rounded-md w-64"
                />
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="text-lg p-2 border rounded-md w-64"
                />
                <button type="submit" className="text-lg px-6 py-2 bg-blue-500 text-white rounded-md">
                    Filtrer
                </button>
            </form>
            {data.totalVisits.length || data.uniqueVisitors.length ? (
                <>
                    <div className="mb-6 text-lg">
                        <p>Total visites : <span className="font-bold">{data.totalVisits.reduce((sum, visit) => sum + visit.count, 0)}</span></p>
                        <p>Visiteurs uniques : <span className="font-bold">{data.uniqueVisitors.reduce((sum, visit) => sum + visit.count, 0)}</span></p>
                    </div>
                    <div className="h-80">
                        <Line data={chartData} options={options} />
                    </div>
                </>
            ) : (
                <p className="text-lg">Aucune donnée disponible pour la période sélectionnée.</p>
            )}
        </div>
    );
};

export default VisitStatistics;
