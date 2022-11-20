import React from 'react'

const Comment = ({children,avatar,username,message,time}) => {

  return (
    <div className='bg-white dark:bg-purple-900 dark:border-none p-4 my-4 border-2'>
        <div className='flex items-center justify-between gap-2'>
            <h2 className='w-2/3 h-auto'>{message}</h2>
            <div className='flex gap-1'>
                <img className='w-6 rounded-full' src={avatar} alt="" /> 
                <h2 className='font-500 text-gray-500'>{username}</h2>
            </div>
        </div>
        <div className='mt-2'>
            {children}
        </div>
    </div>
  )
}

export default Comment