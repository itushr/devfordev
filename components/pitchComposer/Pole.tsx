"use client"

import { Plus, Trash, X } from "lucide-react"
import { useComposerPoll } from "@/store/composerPole"

export default function Pole() {
    const pollEnabled = useComposerPoll((state) => state.pollEnabled)
    const options = useComposerPoll((state) => state.options)
    const updateOption = useComposerPoll((state) => state.updateOption)
    const addOption = useComposerPoll((state) => state.addOption)
    const removeOption = useComposerPoll((state) => state.removeOption)
    const disablePoll = useComposerPoll((state) => state.disablePoll)

    if (!pollEnabled) {
        return <></>
    }

    return (
        <div className="w-full space-y-2">
            {options.map((option, i) => (
                <div
                    key={i}
                    className="flex items-center gap-2 border rounded-md"
                >
                    <div className="text-foreground/50 pl-4 pr-2">
                        #{i + 1}
                    </div>

                    <input
                        value={option}
                        placeholder="Type text here..."
                        onChange={(e) =>
                            updateOption(i, e.target.value)
                        }
                        className="flex-1 border-x bg-transparent px-3 py-4 text-sm outline-none"
                    />

                    {options.length > 2 && (
                        <button
                            type="button"
                            onClick={() => removeOption(i)}
                            className="text-muted-foreground hover:text-foreground pr-4 pl-2"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            ))}

            <div className="flex justify-between">
                <div>
                    {options.length < 5 && (
                        <button
                            type="button"
                            onClick={addOption}
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <Plus size={16} />
                            Add option
                        </button>
                    )}
                </div>
                <div>
                    <button
                        type="button"
                        onClick={disablePoll}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <Trash size={14} />
                        Discard Poll
                    </button>
                </div>
            </div>
        </div>
    )
}