import React from 'react'
import Nav from './nav/Nav'

const Layout = ({children}) => {
  return (
    <div className='mx-6 md:max-w-6xl md:mx-auto p-4 dark:bg-slate-900 dark:text-white'>
        <Nav />
        <main>
            {children}
        </main>
    </div>
  )
}

export default Layout