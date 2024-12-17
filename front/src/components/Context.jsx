import React, { createContext, useState } from 'react'
export const userContext = createContext(
    {
        user:{},
        setUser:() => null,
        selectedDomaine: null,
        setSelectedDomaine: () => null,
    }
)

function Context({children}) {
    const [user, setUser] = useState({})
    const [selectedDomaine, setSelectedDomaine] = useState(null);
  return (
   <>
   <userContext.Provider value={{user, setUser, selectedDomaine, setSelectedDomaine}}>
        {children}
   </userContext.Provider>
   </>
  )
}

export default Context