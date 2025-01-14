import React, { useState, useEffect, useRef } from 'react';
import img1 from "/1.jpg";
import img2 from "/3.jpg";
import img3 from "/2.png";
import Documents from './AfficherDocs';
import AfficheActus from './AfficheActus';

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
      Text: 'Afin d’améliorer sa visibilité et de conduire les programmes de réforme de la Fonction Publique,pilier du développement de notre pays, <strong> le Ministère, du Travail, de l’Emploi, de la Fonction Publique et des Lois Sociales </strong> dont les rôles sont:<br>  -De mettre en œuvre des politiques inclusives pour le travail et l’emploi.<br>-De promouvoir une administration publique moderne et performante.<br>-Garantir la sécurité sociale et les droits fondamentaux des employés , est à pied d\'œuvre dans la mise en place d\'une bibliothèque numérique en son sein.'

    },
    {
      img: img2,
      name: "Direction des Études et des Affaires Juridiques",
      Text: "Cette direction est responsable de : -L'élaboration des textes juridiques : <br> Rédaction, mise à jour, et diffusion des législations et réglementations.<br>-L’appui aux réformes : Réalisation d’études pour moderniser les cadres réglementaires et administratifs.<br>-La gestion des contentieux : Assistance juridique et traitement des dossiers administratifs sensibles."
    },
    {
      img: img3,
      name: "Direction de la Réforme et de la Fonction Publique",
      Text: "Cette direction se concentre sur :-Modernisation administrative : <br>Mise en œuvre des réformes pour une fonction publique performante.<br>-Gestion stratégique des ressources humaines : <br>Planification et optimisation des effectifs, des compétences et des parcours professionnels.<br>-Promotion des valeurs éthiques : Renforcement de la déontologie et de la transparence dans l’administration publique."
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
          <h1 ref={nameRef} className="text-4xl text-white">{sliderContent[active].name}</h1>
          <p ref={textRef} className="mt-5 text-lg text-left text-white">{sliderContent[active].Text}</p>
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
