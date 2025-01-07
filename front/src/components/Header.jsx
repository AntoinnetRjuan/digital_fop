import React from 'react';
import logo from "../assets/logo-madagascar.webp";
import MTEFOP from "../assets/MTEFOP.png";
import DEAJ from "../assets/DEAJ.png";
// import  phone from "../assets/phone-call_5068731.svg"

function Header() {
  return (
    <div className='w-full fixed top-0 bg-white text-neutralDGrey flex justify-between shadow-xl z-50'>
        <h1 className='flex items-center'>
            <img src={MTEFOP} alt='MTEFOP logo' className='w-16 md:w-20 lg:w-24 ml-2'/>
        </h1>
        <h1 className='flex items-center'>
            <img src={logo} alt='Madagascar logo' className='w-16 md:w-20 lg:w-24'/>
        </h1>
        <h1 className='flex items-center'>
            <img src={DEAJ} alt='DEAJ logo' className='w-16 md:w-20 lg:w-24 mr-2'/>
        </h1>
        {/* Uncomment if you want to add the phone section */}
        {/* <div className='gap-x-4 flex mt-2 mr-4'>
            <div className='shrink-0'>
                <img src={phone} alt='phone icon' className='w-6 md:w-8 lg:w-10'/>
            </div> 
            <div>
                <h3> Tel : (+261)20 22 650 10</h3>
            </div>
        </div> */}
    </div>
  );
}

export default Header;
