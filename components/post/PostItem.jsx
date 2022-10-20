import React from 'react'

const PostItem = ({avatar, username, caption, image}) => {

  return (
    <div className='mb-8 p-6 max-w-md m-auto bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700'>
      <div>
        <h2 className='font-bold text-xl'>{caption}</h2>
      </div>
      <div className='mt-4 flex items-center gap-2'>
        <img src={image} className="w-full object-cover rounded-lg" />
      </div>
      <div className='py-4 flex items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <img src={avatar} className="w-16 h-16 rounded-full" />
            <h2 className='font-semibold'>{username}</h2>
          </div>
          <div>
            <button type="button" className="text-white bg-purple-400 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center  dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
              Comment
            </button>
          </div>
      </div>
      
    </div>
  )
}

export default PostItem