import React, { useState, useEffect, useRef } from 'react';
import img1 from "/1.jpg";
import img2 from "/3.jpg";
import img3 from "/9.jpg";
import Documents from './AfficherDocs';
import AfficheActus from './AfficheActus';
import AnimatedCard from './AnimatedCard';
import axios from 'axios';
import AppRating from './AppRating';
import { motion } from "framer-motion";

const Accueil = () => {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(0);
  const [data, setData] = useState({ totalVisits: 0, uniqueVisitors: 0, totalVisitsPerDay: [], uniqueVisitorsPerDay: [], visitsToday: 0 });
  // Refs
  const contentRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const nameRef = useRef("");
  const textRef = useRef("");

  const sliderContent = [
    {
      img: img1,
      name: "Bienvenue",
      Text: 'Afin d’améliorer sa visibilité et de conduire les programmes de réforme de la Fonction Publique, pilier du développement de notre pays, <strong> le Ministère du Travail, de l’Emploi et de la Fonction Publique et des Lois Sociales </strong> est à pied d\'œuvre dans la mise en place d\'une bibliothèque numérique en son sein.'
    },
    {
      img: img2,
      name: "Réforme en cours",
      Text: "<strong> Le Ministère du Travail,de l'Emploi  et de la fonction publique </strong> met en place des initiatives pour moderniser l'administration publique et améliorer l'efficacité des services offerts aux citoyens. Une bibliothèque numérique est une des pierres angulaires de ces réformes."
    },
    {
      img: img3,
      name: "Notre vision",
      Text: "Dans une démarche continue d'amélioration de la transparence et de l'accessibilité de ses services, <strong> le Ministère </strong> œuvre pour la mise en place de solutions numériques, y compris une bibliothèque numérique qui soutiendra la gestion des informations et de la diffusion des ressources publiques."
    }
  ];
  const formatNumber = (num) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + "M";
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + "k";
    }
    return num;
  };
  const Slide = (type) => {
    let local;
    if (type === 'next') {
      local = active + 1;
      setActive(local >= sliderContent.length ? 0 : local);
    }

    if (type === 'prev') {
      local = active - 1;
      setActive(local < 0 ? sliderContent.length - 1 : local);
    }
    setPrev(active);
  };
  const scrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  // Effect hook to handle initial setup and automatic slide change
  useEffect(() => {
    // Initial animations setup
    contentRef.current.style.left = '-100%';
    prevRef.current.style.left = '-10%';
    nextRef.current.style.right = '-10%';

    // Simulate slide transition
    setTimeout(() => {
      nameRef.current.innerText = sliderContent[active].name;
      textRef.current.innerHTML = sliderContent[active].Text;  // Use HTML content
      contentRef.current.style.left = '5%';
      prevRef.current.style.left = '0%';
      nextRef.current.style.right = '0%';
    }, 1000);

    // Automatic slide change every 10 seconds
    const intervalId = setInterval(() => {
      setActive((prevActive) => (prevActive === sliderContent.length - 1 ? 0 : prevActive + 1));
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [active]);
  useEffect(() => { fetchStatistics(); }, []);
  const fetchStatistics = async () => {
    try {
      const { data: stats } = await axios.get("http://localhost:8000/api/visit-statistics/");
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

  return (
    <>
      <div className="relative shadow-lg overflow-hidden ">
        {/* Slider Container */}
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative">
          {sliderContent.map((slide, i) => (
            <>
              <img
                key={i}
                src={slide.img}
                alt="slideImg"
                className={`h-full w-full absolute object-cover inset-0 duration-[2.5s] ease-out transition-[clip-path] ${i === active ? "clip-visible" : "clip-hidden"}`}
              />
            </>
          ))}
        </div>
        <motion.div
          className="fixed-visits text-white"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
          layout
        >
          <p>
            Total de visites :{" "}
            <motion.span
              className="font-bold text-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
            >
              {formatNumber(data.totalVisits)}
            </motion.span>
          </p>
        </motion.div>
        {/* Navigation Buttons */}
        <div>
          <button id="back" ref={prevRef} onClick={() => Slide("prev")} className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl sm:text-4xl hover:scale-125 transition-transform">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>
          <button id="forward" ref={nextRef} onClick={() => Slide("next")} className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl sm:text-4xl hover:scale-125 transition-transform">
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </button>
        </div>

        {/* Slider Content */}
        <div className="content" ref={contentRef}>
          <div className="flex flex-col justify-center h-full">
            <h1 ref={nameRef} className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-bold">
              {sliderContent[active].name}
            </h1>
            <p ref={textRef} className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg lg:text-xl text-left text-white">
              {sliderContent[active].Text}
            </p>
          </div>
        </div>
        {/* Flèche pour descendre */}
        <motion.div
          className="absolute bottom-0.5 sm:bottom-10 md:bottom-12 lg:bottom-16 left-1/2 transform -translate-x-1/2 cursor-pointer text-white backdrop-blur-sm sm:backdrop-blur-md md:backdrop-blur-lg lg:backdrop-blur-xl p-2 sm:p-3 md:p-4 rounded-full"
          onClick={scrollDown}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
        >
          <ion-icon
            name="chevron-down-circle-outline"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl hover:text-gray-300"
          ></ion-icon>
        </motion.div>
      </div>

      {/* Other Components */}
      <Documents />
      <div>
        <h1 className="text-2xl font-semibold text-gray-400 px-5 py-5 flex flex-col items-center justify-center">Actualités</h1>
        <AfficheActus />
      </div>
      <div className='bg-gradient-to-br from-primary/70 grid place-items-center'>
        <AnimatedCard />
      </div>
      <div className='apprating'>
        <AppRating />
      </div>
    </>
  );
};

export default Accueil;