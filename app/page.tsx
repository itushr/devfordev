import Logo from '@/components/Logo'
import React from 'react'
import Sidebar from './Sidebar'
import RightPanel from './RightPanel'

const page = () => {
  return (
    <div className='bg-card'>
      <div className='max-w-350 mx-auto min-h-dvh flex gap-1 py-1'>
        {/* Left Panel */}
        <div className='w-60 bg-card h-full'>
          <div className='w-30 p-5'>
            <Logo />
          </div>
          <Sidebar />
        </div>

        {/* Main */}
        <div className='flex-1 bg-background rounded-xl'></div>

        {/* Right Panel */}
        <div className='w-100'>
          <RightPanel />
        </div>
      </div>
    </div>
  )
}

export default page