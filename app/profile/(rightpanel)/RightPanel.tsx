import { Search } from 'lucide-react'
import React from 'react'

const RightPanel = () => {
  return (
    <div className='w-100 border-x sticky top-0 h-dvh'>

      {/* searchbar */}
      <div className="h-15 border-b flex items-center px-5">
        <div className="flex items-center border px-5 py-2 rounded-full gap-2 w-full">
          <div>
            <Search size={15} />
          </div>
          <input placeholder="search" className="w-full outline-none" />
        </div>
      </div>

    </div>
  )
}

export default RightPanel