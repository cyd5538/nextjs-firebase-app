import React from 'react'
import Nav from './Nav'

const Layout = ({children}) => {
  return (
    <div className='mx-6 md:max-w-2xl md:mx-auto'>
        <Nav />
        <main>
            {children}
        </main>
    </div>
  )
}

export default Layout