import React from 'react'


const Navbar = () => {
  return (
    <nav className='flex justify-between bg-gray-700 text-white'>
        <div>
            <span className='font-bold text-xl mx-9'>iTask</span>
        </div>
        <ul className='flex gap-10 mx-9' >
            <li className='cursor-pointer hover:font-bold'>Home</li>
            <li className='cursor-pointer hover:font-bold'>Your Task</li>
        </ul>
    </nav>
  )
}

export default Navbar
