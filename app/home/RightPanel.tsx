import { Search } from 'lucide-react'

const RightPanel = () => {
    return (
        <div className="w-100 border-x">
            <div className="h-15 flex items-center px-5">
                <div className="flex items-center border px-5 py-2 rounded-full gap-2 w-full">
                    <div>
                        <Search size={15} />
                    </div>
                    <input placeholder="search" className="w-full outline-none" />
                </div>
            </div>
            <div className="h-120 border-y p-2" style={{
                backgroundColor: 'var(--background)',
                backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 4px, var(--border) 4px, var(--border) 5px)`,
            }}>
                <div className="h-full w-full bg-background rounded-2xl"></div>
            </div>

            <div className="h-120 mt-2 border-y p-2" style={{
                backgroundColor: 'var(--background)',
                backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 4px, var(--border) 4px, var(--border) 5px)`,
            }}>
                <div className="h-full w-full bg-background rounded-2xl"></div>
            </div>
        </div>
    )
}

export default RightPanel