import React from 'react'

const PostItem = ({children, avatar, username, caption, text, image}) => {

  return (
    <div className='mb-8 p-6 max-w-md m-auto bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700'>
      <div>
        <h2 className='font-bold text-xl'>{caption}</h2>
      </div>
      <div className='mt-4 flex items-center gap-2'>
        <img src={image} className="w-full object-cover rounded-lg" />
      </div>
      <div className='mt-4 flex items-center gap-2 from-neutral-800 text-base'>
        {text}
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