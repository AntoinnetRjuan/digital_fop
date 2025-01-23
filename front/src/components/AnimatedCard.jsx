import React from 'react'
import photo1 from "/ANR-1.jpg";
import img1 from "../assets/logo-madagascar.webp";
import img2 from "../assets/MTEFOP.png";
import img3 from "../assets/DEAJ.png";
import photo2 from "/5.jpeg";
import photo3 from "/2.png";
import { Fade, Slide } from "react-awesome-reveal"
import Modal from "./Modal";
import { useState } from 'react';


const CardsData = [
    {
        id: 1,
        img: photo1,
        title: "Gouvernement Malagasy",
        desc: "descri de l'image 1",
        logo_img: img1,
    },
    {
        id: 2,
        img: photo2,
        title: "Ministère du Travail et de la Fonction Publique",
        desc: "descri de l'image 2",
        logo_img: img2,
    },
    {
        id: 3,
        img: photo3,
        title: "Direction des Etudes et des Affaires Juridiques",
        desc: "descri de l'image 3",
        logo_img: img3,
    }
];
const AnimatedCard = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedButton, setSelectedButton] = useState(null);
    const [showInfoId, setShowInfoId] = useState(null)

    const handleShowInfo = (id) => {
        setShowInfoId(id)
        setShowModal(true);

    }

    const tempData = [...CardsData]
    const filtered = tempData.find((data) => data.id == showInfoId)

    const closeModal = () => {
        setShowModal(false);
        setSelectedButton(null);
    };
    return (
        <div className='container mx-auto'>
            <h1 className='text-center text-white font-bold text-3xl mb-14 mt-5 sm:mt-0'>A Propos</h1>


            {showModal && (<Modal onClose={closeModal}>
                <h2 className="text-lg font-bold mb-4">{filtered.title}</h2>
                <p>{filtered.desc}</p>
            </Modal>)
            }
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center gap-12">
                {
                    CardsData.map(({ id, img, title, desc, logo_img }) => {
                        return (
                            <div key={id} className='text-white shadow-md rounded-lg overflow-hidden relative group'>
                                <img src={img} alt="" className='w-full max-w-[400px] h-[290px] rounded-lg' />
                                <div className='absolute left-0 top-[-100%] opacity-0 group-hover:opacity-100 group-hover:top-[0] p-4 w-full h-full bg-black/60 group
                        group-hover:backdrop-blur-sm duration-500'>

                                    <div className='space-y-4 h-full'>
                                        <Slide cascade>
                                            <img src={logo_img} alt='' className='md:w-20 lg:w-24 ml-2 left-0 rounded-lg duration-300' />
                                            <h1 className='text-2xl font-bold'>{title}</h1>
                                            <Fade cascade damping={0.05}>
                                                {desc}
                                            </Fade>
                                            <div>
                                                <button onClick={() => handleShowInfo(id)} className='border border-white px-4 py-2 rounded-lg hover:bg-black/20 duration-300'>view</button>
                                            </div>
                                        </Slide>
                                    </div>
                                </div>

                            </div>
                        )

                    })
                }
            </div>
        </div>
    )
}

export default AnimatedCard
