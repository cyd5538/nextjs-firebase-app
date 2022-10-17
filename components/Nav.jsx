import React from 'react'
import Link from 'next/link'
import {auth} from '../utils/firebase';
import {useAuthState} from 'react-firebase-hooks/auth'; 


const Nav = () => {
  const [user, loading] = useAuthState(auth);
  
  return (
    <div className='flex justify-between items-center py-10'>
        <Link href="/">
            <button className='text-lg font-medium'>CYJ twitter</button>
        </Link>
        <ul className='flex items-center gap-4'>
        {!user &&  
          <Link href="/login">
            <a className='py-2 px-4 text-sm bg-zinc-700 text-white rounded-lg font-medium ml-8'>Join</a>
          </Link>
        }
        {user &&  
          <>
            <Link href="/login">
              <a className='py-2 px-4 text-sm bg-zinc-700 text-white rounded-lg font-medium'>글 쓰기</a>
            </Link>
            <Link href="/login">
              <a className='py-2 px-4 text-sm bg-zinc-700 text-white rounded-lg font-medium '>User</a>
            </Link>
          </>  
        }
      </ul>
    </div>
  )
}

export default Nav