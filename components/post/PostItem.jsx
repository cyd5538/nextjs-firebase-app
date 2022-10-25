import React from 'react'

const PostItem = ({children, avatar, username, title, progress, recruitment, player, text, image}) => {

  return (
    <div className='mb-8 p-6 max-w-md min-w-[47%] bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700'>
      <div>
        <h2 className='font-bold text-2xl'>{title}</h2>
      </div>
      <div className='mt-4 mb-4 text-gray-400'>
        #{progress} #{recruitment} #{player}
      </div>
      <div className='mt-4 flex items-center gap-2'>
        <img src={image} className="w-full h-96 object-cover rounded-lg" />
      </div>
      <div className='py-4 flex items-center justify-between gap-4 mt-6'>
          <div className='flex items-center gap-2'>
            <img src={avatar} className="w-12 h-12 rounded-full" />
            <h2 className='font-500 text-sm'>{username}</h2>
          </div>
      </div>
      {children}
    </div>
  )
}

export default PostItem