import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Configuration Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VisitStatistics = () => {
    const [data, setData] = useState({ totalVisits: 0, uniqueVisitors: 0, totalVisitsPerDay: [], uniqueVisitorsPerDay: [], visitsToday: 0 });
    const [filters, setFilters] = useState({ startDate: "", endDate: "" });
    const ObjectifVisitPerDay = 200;

    useEffect(() => { fetchStatistics(); }, []);

    const fetchStatistics = async () => {
        try {
            const { data: stats } = await axios.get("http://localhost:8000/api/visit-statistics/", {
                params: { start_date: filters.startDate, end_date: filters.endDate },
            });
            setData({
                totalVisits: stats.total_visits || 0,
                uniqueVisitors: stats.unique_visitors || 0,
                totalVisitsPerDay: stats.total_visits_per_day || [],
                uniqueVisitorsPerDay: stats.unique_visitors_per_day || [],
                visitsToday: stats.visits_today || 0,
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des statistiques :", error);
            setData({ totalVisits: 0, uniqueVisitors: 0, totalVisitsPerDay: [], uniqueVisitorsPerDay: [], visitsToday: 0 });
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const chartData = {
        labels: data.totalVisitsPerDay.map((visit) => visit.day),
        datasets: [
            {
                label: "Visites totales",
                data: data.totalVisitsPerDay.map((visit) => visit.count),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                tension: 0.4,
            },
            {
                label: "Visiteurs uniques",
                data: data.uniqueVisitorsPerDay.map((visit) => visit.count),
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Permet au graphique de s'adapter à la hauteur définie
        plugins: { legend: { position: "top" } },
        scales: {
            x: { title: { display: true, text: "Dates" } },
            y: { title: { display: true, text: "Nombre" }, beginAtZero: true },
        },
    };

    return (
        <div className="p-4 sm:p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto text-center">
            <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                Statistiques de visites
            </h1>
            <form
                onSubmit={(e) => { e.preventDefault(); fetchStatistics(); }}
                className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4"
            >
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="text-base sm:text-lg p-2 border rounded-md w-full sm:w-48"
                />
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="text-base sm:text-lg p-2 border rounded-md w-full sm:w-48"
                />
                <button
                    type="submit"
                    className="text-base sm:text-lg px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-md"
                >
                    Filtrer
                </button>
            </form>
            {data.totalVisitsPerDay.length || data.uniqueVisitorsPerDay.length ? (
                <>
                    <div className="mb-4 sm:mb-6 text-base sm:text-lg">
                        <p>Total visites : <span className="font-bold">{data.totalVisits}</span></p>
                        <p>Visiteurs : <span className="font-bold">{data.uniqueVisitors}</span></p>
                        <p>Le nombre de visites a augmenté de <span className={`font-bold ${(data.visitsToday * 100) / ObjectifVisitPerDay < 25
                                ? 'text-red-500'   // Rouge si < 25
                                : (data.visitsToday * 100) / ObjectifVisitPerDay < 50
                                    ? 'text-yellow-500' // Jaune si entre 25 et 50
                                    : 'text-green-500'  // Vert si ≥ 50
                            }`}>{(data.visitsToday * 100) / ObjectifVisitPerDay} %</span> aujourd'hui</p>
                    </div>
                    <div className="h-64 sm:h-80">
                        <Line data={chartData} options={options} />
                    </div>
                </>
            ) : (
                <p className="text-base sm:text-lg">Aucune donnée disponible pour la période sélectionnée.</p>
            )}
        </div>
    );
};

export default VisitStatistics;