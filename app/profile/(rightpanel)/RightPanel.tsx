import Separator from '@/components/Separator'
import { Search } from 'lucide-react'
import Network from './Network'

const RightPanel = () => {
  return (
    <div className='w-100 border-x sticky top-0 h-dvh flex flex-col'>

      {/* searchbar */}
      <div className="h-15 border-b flex items-center px-5">
        <div className="flex items-center border px-5 py-2 rounded-full gap-2 w-full">
          <div>
            <Search size={15} />
          </div>
          <input placeholder="search" className="w-full outline-none" />
        </div>
      </div>

      <div className='flex-1'>
        <Network />
      </div>

    </div>
  )
}

export default RightPanel