import React from 'react'

const DashboardMypost = ({children, avatar, userName, text}) => {
    return (
        <div className='bg-white p-8 border-b-2 rounded-lg'>
            <div className='flex items-center gap-2'>
                <img src={avatar} className="w-16 h-16 rounded-full" />
                <h2>{userName}</h2>
            </div>
            <div className='py-4'>
                <p>{text}</p>
            </div>
            {children}
        </div>
    )
}

export default DashboardMypost