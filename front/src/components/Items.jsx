import React from 'react'


const Items = ({Links,title}) => {
    return (
      <div>
        <ul>
         <h1 className='mb-1 font-semibold text-base text-blue-800'> {title}</h1>
         {
            Links.map((Link)=>(
                <li key={Link.name}>
                    <a className='text-gray-400 hover:text-indigo-500 duration-300 text-sm cursor-pointer leading-6' href={Link.link}>{Link.name}</a>
                </li>
            ))
         } 
  
        </ul>
      </div>
    )
  }

export default Items
