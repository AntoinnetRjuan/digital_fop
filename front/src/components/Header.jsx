import React from 'react'
import logo from "../assets/logo-madagascar.webp"
import  MTEFOP from "../assets/MTEFOP.png"
import  DEAJ from "../assets/DEAJ.png"
// import  phone from "../assets/phone-call_5068731.svg"


function Header() {
  return (
    <div className=' w-[100%] fixed top-0 bg-white text-neutralDGrey flex justify-between shadow-xl flex-wrap py-1 z-50'>
        <h1> <img src={MTEFOP} alt='logo' className='size-[93px] ml-8'/></h1>
        <h1 > <img src={logo} alt='logo' className='size-[93px] '/></h1>
        <h1 > <img src={DEAJ} alt='logo' className='size-[93px] mr-8'/></h1>
        {/* <div className='gap-x-4 flex mt-9 mr-8'>
            <div className='shrink-0'>
                <img src={phone} alt='logo' className='size-4 '/>
            </div> 
            <div>
                <h3 > Tel : (+261)20 22 650 10</h3>
            </div>
            
        </div> */}
    </div>
  )
}

export default Header
