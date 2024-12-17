import React, { useContext } from 'react'
import SearchBar from './SearchBar';
import Documents from './AfficherDocs';
import { useState, useRef, useEffect } from 'react';
import img1 from "/1.jpg";
import img2 from "/3.jpg";
import img3 from "/2.png";
import AfficheActus from './AfficheActus';

const Accueil = () => {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(0);

  //ref 
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
      name: "image 2",
      // link :"https://www.primature.gov.mg/index.php/category/conseil-du-gouvernement/",
      Text: "Afin d’améliorer sa visibilité et de conduire les programmes de réforme de la Fonction Publique, pilier du développement de notre pays, le Ministère, du Travail, de l’Emploi, de la Fonction Publique et des Lois Sociales est à pied d'œuvre dans la mise en place d'une bibliothèque numérique en son sein"
    },
    {
      img: img3,
      name: "image 3",
      Text: "Afin d’améliorer sa visibilité et de conduire les programmes de réforme de la Fonction Publique, pilier du développement de notre pays, le Ministère, du Travail, de l’Emploi, de la Fonction Publique et des Lois Sociales est à pied d'œuvre dans la mise en place d'une bibliothèque numérique en son sein"

    }

  ]

  const Slide = (type) => {
    let local;
    if (type === 'next') {
      local = active + 1;
      // console.log (local /sliderContent.length -1);
      sliderContent.length - 1 < local ? setActive(0) :
        setActive(local);
    }

    if (type === 'prev') {
      local = active - 1;
      local < 0 ? setActive(sliderContent.length - 1) : setActive(local);

    };
    setPrev(active);

  }
  useEffect(() => {
    contentRef.current.style.left = '-100%';
    prevRef.current.style.left = '-10%';
    nextRef.current.style.right = '-10%';
    setTimeout(() => {
      nameRef.current.innerText = sliderContent[active].name;
      TextRef.current.innerText = sliderContent[active].Text;
      contentRef.current.style.left = '5%';
      prevRef.current.style.left = '0%';
      nextRef.current.style.right = '0%';

    }, 1000)

    setInterval(() => {
      if(active == sliderContent.length - 1){
        setActive(active - active)
      }else{

        setActive(active + 2)
      }
    }, 10000)
  }, [active]);

  return (
    <>
      <div>

        <div className='mt-24 relative shadow-lg overflow-hidden'>

          <div className='w-[100%] h-[600px] relative '>
            {

              sliderContent.map((slide, i) => {
                return (
                  <img src={slide.img} key={i} alt='slideImg'
                    className={`h-[600px] w-full absolute object-cover inset-0 duration-[2.5s] ease-out transition-[clip-path] ${i === active ? "clip-visible" : "clip-hidden"}`} />
                )
              })
            }
          </div>
          <div>

            <button id='back' ref={prevRef} onClick={() => Slide("prev")}>
              <ion-icon name="chevron-back-outline" size="large"></ion-icon>

            </button>

            <button id='forward' ref={nextRef} className='right-0' onClick={() => Slide("next")}>
              <ion-icon name="chevron-forward-outline" size="large"></ion-icon>
            </button>

          </div>
          <div className='content' ref={contentRef}>

            <h1 ref={nameRef} className='text-4xl text-white'>
              {sliderContent[0].name}
            </h1>
            <p ref={TextRef} className=' mt-5 text-lg text-left text-white'>
              {sliderContent[0].Text}
            </p>
          </div>
        </div>
      </div>
      <Documents />
      <AfficheActus />
      <div>
        <h1 className="text-2xl font-semibold text-gray-400 mt-8 flex flex-col items-center justify-center ">Actualités</h1>

        {/* <p  className=' text-center m-[100px]'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. A enim possimus, temporibus beatae eos quasi consequuntur ipsam veritatis dolore atque repellendus illo voluptatem. Recusandae tempora unde quos nisi, laboriosam delectus.</p> */}

        <p></p>
      </div>
    </>
  )
}

export default Accueil