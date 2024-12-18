import React from 'react';
import Documents from './AfficherDocs';
import { useContext } from 'react';
import { userContext } from './Context';
function Dashboard() {
    const { user } = useContext(userContext)
    return (
        <>
            <div className='mt-40'>
                <Documents isAdmin={true} />
            </div>
        </>
    );
}

export default Dashboard;
