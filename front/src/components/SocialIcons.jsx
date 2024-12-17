import React from 'react'

const SocialIcons = ({Icons}) => {
  return (
    <div className='text-indigo-500'>
      {Icons.map((icon)=>(
        <a href={icon.link}>
          <span  key={icon.name} className='p-2 cursor-pointer inline-flex items-center rounded-full bg-gray-700 mx-1.5
         text-xl  hover:text-gray-100 hover:bg-indigo-500 duration-300 '>
            <ion-icon name={icon.name} ></ion-icon>
        </span>
        </a>
      ))}
    </div>
  )
}

export default SocialIcons 
