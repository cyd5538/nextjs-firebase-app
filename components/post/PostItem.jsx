import React from 'react'

const PostItem = ({children, stack, avatar, username, title, progress, recruitment, player, startday, image}) => {

  return (
    <div className='mb-8 p-6 max-w-md min-w-[47%] bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700'>
      <div>
        <h2 className='font-bold text-2xl mb-10'>{title}</h2>
      </div>
      <div>
        <h2 className='text-lg text-gray-500'>시작 예정일 {startday}</h2>
      </div>
      <div className='mt-4 mb-4 text-gray-400'>
        #{progress} #{recruitment} #{player}
      </div>
      <div className='mt-4 flex items-center gap-2'>
        <img src={image} className="w-full m-auto h-72 object-cover rounded-md" />
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