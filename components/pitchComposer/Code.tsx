import { useState } from "react"
import { CodeBlockEditable } from "../ui/code-block-editable"
import { Plus, X } from "lucide-react"

type File = {
  name: string
  content: string
}

export default function Code() {
  const [files, setFiles] = useState<File[]>([
    {
      name: "1.jsx",
      content: `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`,
    },
    {
      name: "2.jsx",
      content: `function MyComponent2(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`,
    },
  ])

  const [activeCode, setActiveCode] = useState(0)

  const closeFile = (index: number) => {
    if (files.length <= 1) return

    setFiles((prev) => prev.filter((_, i) => i !== index))

    setActiveCode((current) => {
      if (index < current) return current - 1
      if (index === current) return Math.min(current, files.length - 2)
      return current
    })
  }

  const addFile = () => {
    const newFile: File = {
      name: `${files.length + 1}.jsx`,
      content: "",
    }

    setFiles((prev) => [...prev, newFile])
    setActiveCode(files.length)
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="flex w-full overflow-x-auto scrollbar-hide bg-card text-sm text-foreground/50">
        {files.map((file, index) => (
          <div
            key={file.name}
            onClick={() => setActiveCode(index)}
            className={`flex shrink-0 cursor-pointer items-center gap-2 px-3 py-3 ${
              activeCode === index
                ? "text-foreground"
                : "hover:text-pink-500"
            }`}
          >
            <div>{file.name}</div>

            <X
              size={15}
              onClick={(e) => {
                e.stopPropagation()
                closeFile(index)
              }}
              className="hover:text-foreground"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addFile}
          className="shrink-0 px-3 text-foreground/50 hover:text-foreground"
        >
          <Plus size={16} />
        </button>
      </div>

      <CodeBlockEditable
        code={files[activeCode].content}
        language="jsx"
      />
    </div>
  )
}