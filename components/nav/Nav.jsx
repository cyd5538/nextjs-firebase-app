import React from 'react'
import Link from 'next/link'
import {auth} from '../../utils/firebase';
import {useAuthState} from 'react-firebase-hooks/auth'; 
import NavbarDropdown from './NavbarDropdown';


const Nav = () => {
  const [user, loading] = useAuthState(auth);
  
  return (
    <div className='flex justify-between items-center py-10'>
        <Link href="/">
            <button className='text-3xl font-bold'>Home</button>
        </Link>
        <ul className='flex items-center gap-4'>
        {!user &&  
          <Link href="/login">
            <a className='py-2 px-4 text-sm bg-zinc-700 text-white rounded-lg font-medium ml-8'>Join</a>
          </Link>
        }
        {user &&  
          <>
            <Link href="/post">
              <li className='py-2 px-4 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm text-center mr-2 mb-2'>글 쓰기</li>
            </Link>
            <NavbarDropdown />
          </>  
        }
      </ul>

    </div>
  )
}

export default Nav

