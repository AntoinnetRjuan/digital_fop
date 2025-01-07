import React, { useState, useEffect, useRef } from 'react';
import img1 from "/1.jpg";
import img2 from "/3.jpg";
import img3 from "/2.png";
import Documents from './AfficherDocs';
import AfficheActus from './AfficheActus';
import RemarkForm from './RemarkForm';

const Accueil = () => {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(0);

  // Refs
  const contentRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const nameRef = useRef("");
  const TextRef = useRef("");

  const sliderContent = [
    {
      img: img1,
      name: "Bienvenue",
      Text: "Afin d’améliorer sa visibilité et de conduire les programmes de réforme de la Fonction Publique, pilier du développement de notre pays, le Ministère, du Travail, de l’Emploi, de la Fonction Publique et des Lois Sociales est à pied d'œuvre dans la mise en place d'une bibliothèque numérique en son sein."
    },
    {
      img: img2,
      name: "Réformes en cours",
      Text: "Le Ministère du Travail et de la Fonction Publique met en place des initiatives pour moderniser l'administration publique et améliorer l'efficacité des services offerts aux citoyens. Une bibliothèque numérique est une des pierres angulaires de ces réformes."
    },
    {
      img: img3,
      name: "Notre Vision",
      Text: "Dans une démarche continue d'amélioration de la transparence et de l'accessibilité de ses services, le Ministère œuvre pour la mise en place de solutions numériques, y compris une bibliothèque numérique qui soutiendra la gestion des informations et la diffusion des ressources publiques."
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
      TextRef.current.innerText = sliderContent[active].Text;
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
        <div className="w-[100%] h-[600px] relative">
          {sliderContent.map((slide, i) => (
            <img
              key={i}
              src={slide.img}
              alt="slideImg"
              className={`h-[600px] w-full absolute object-cover inset-0 duration-[2.5s] ease-out transition-[clip-path] ${i === active ? "clip-visible" : "clip-hidden"}`}
            />
          ))}
        </div>
        <div>
          <button id="back" ref={prevRef} onClick={() => Slide("prev")}>
            <ion-icon name="chevron-back-outline" size="large"></ion-icon>
          </button>
          <button id="forward" ref={nextRef} onClick={() => Slide("next")}>
            <ion-icon name="chevron-forward-outline" size="large"></ion-icon>
          </button>
        </div>
        <div className="content" ref={contentRef}>
          <h1 ref={nameRef} className="text-4xl text-white">{sliderContent[0].name}</h1>
          <p ref={TextRef} className="mt-5 text-lg text-left text-white">{sliderContent[0].Text}</p>
        </div>
      </div>
      <Documents />
      <div>
        <h1 className="text-2xl font-semibold text-gray-400 mt-8 flex flex-col items-center justify-center">Actualités</h1>
        <AfficheActus /> 
      </div>
    </>
  );
};

export default Accueil;
