import React, { useState, useEffect, useRef } from 'react';
import img1 from "/1.jpg";
import img2 from "/3.jpg";
import img3 from "/2.png";
import Documents from './AfficherDocs';
import AfficheActus from './AfficheActus';
import AnimatedCard from './AnimatedCard';

const Accueil = () => {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(0);

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

  return (
    <>
      <div className="mt-24 relative shadow-lg overflow-hidden">
        {/* Slider Container */}
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative">
          {sliderContent.map((slide, i) => (
            <img
              key={i}
              src={slide.img}
              alt="slideImg"
              className={`h-full w-full absolute object-cover inset-0 duration-[2.5s] ease-out transition-[clip-path] ${i === active ? "clip-visible" : "clip-hidden"}`}
            />
          ))}
        </div>

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
    </>
  );
};

export default Accueil;