"use client"

import { Plus, X } from "lucide-react"
import { useState } from "react"

type PoleProps = {
    options?: string[]
    onChange?: (options: string[]) => void
}

export default function Pole({
    options: initialOptions = ["", ""],
    onChange,
}: PoleProps) {
    const [options, setOptions] = useState(initialOptions)

    const update = (next: string[]) => {
        setOptions(next)
        onChange?.(next)
    }

    return (
        <div className="w-full space-y-2">
            {options.map((option, i) => (
                <div key={i} className="flex items-center gap-2 border rounded-md">
                    <div className="text-foreground/50 pl-4 pr-2">
                        #{i+1}
                    </div>
                    <input
                        value={option}
                        placeholder="Type text here..."
                        onChange={(e) => {
                            const next = [...options]
                            next[i] = e.target.value
                            update(next)
                        }}
                        className="flex-1 border-x bg-transparent px-3 py-4 text-sm outline-none"
                    />

                    {options.length > 2 && (
                        <button
                            type="button"
                            onClick={() => update(options.filter((_, j) => j !== i))}
                            className="text-muted-foreground hover:text-foreground pr-4 pl-2"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            ))}

            {options.length < 5 && (
                <button
                    type="button"
                    onClick={() => update([...options, ""])}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <Plus size={16} />
                    Add option
                </button>
            )}
        </div>
    )
}