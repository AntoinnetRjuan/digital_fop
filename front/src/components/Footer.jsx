import React from 'react'
import ItemsContener from './ItemsContener'
import SocialIcons from './SocialIcons'
import {Icons} from './MenuFooter' 

const Footer = ()  =>{
  return (
    <footer className='bg-gray-900 z-50 text-white'>
        <div className='md:flex md:justify-between md:items-center sm:px-12 px-4 bg-[#ffffff19] py-7'>
            <h1 className='lg:text-4xl text-3xl md:mb-0 mb-6 lg:leading-normal font-semibold md:w-2/5'>
                <span className='text-indigo-500'>Loi </span>
                et Règlement
                <p className='lg:text-sm text-sm'>
                Ce sont les textes de portée générale parus dans le Journal Officiel qui sont accessibles
                dans cette rubrique. Elle contient les références des textes parus depuis 1897 et les
                textes intégraux parus depuis 1998.</p>

            </h1>
            <div>
                <input type="text" placeholder='Enter Your Mail' className='text-gray-800 sm:w-72 w-full 
                sm:mr-5 mr-1 lg:mb-0 mb-4 py-2.5 rounded px-2 focus:outline-none' />

                <button className='bg-indigo-500 hover:bg-indigo-500 duration-300 px-5 py-2.5 font-[Poppins] rounded-md text-white
                md:w-auto w-full'>
                  Send
                </button>
            </div>

        </div>
        <ItemsContener/>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center pt-2 text-gray-400 text-sm pb-8'>
          <span>© 2024 Apply.All rights reserved</span>
          <span>Terms .Privacy Policy</span>
          {/* <SocialIcons Icons={Icons}/> */}
          <SocialIcons Icons={Icons}/>
        </div>
    </footer>
  )
}

export default Footer
