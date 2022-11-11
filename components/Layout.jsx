import React from 'react'
import Nav from './nav/Nav'

const Layout = ({children}) => {
  return (
    <div className='mx-6 md:max-w-6xl md:mx-auto p-4'>
        <Nav />
        <main>
            {children}
        </main>
    </div>
  )
}

export default Layout