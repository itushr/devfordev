import { ReactNode } from "react"

const Terminal = ({ children, onClose }: { children: ReactNode; onClose?: () => void }) => {
    return (
        <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-neutral-800 bg-background text-sm text-neutral-200 shadow-2xl">
            {/* Header */}
            <div className="flex h-10 items-center border-b border-neutral-800 bg-neutral-950 px-4">
                <div className="flex gap-2">
                    <span onClick={onClose} className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                </div>
            </div>

            {/* Terminal Body */}
            <div className="p-5 font-mono">
                {children}
            </div>
        </div>
    )
}

export default Terminal