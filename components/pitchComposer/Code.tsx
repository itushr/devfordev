import { useState } from "react"
import { CodeBlockEditable } from "../ui/code-block-editable"
import { Plus, X } from "lucide-react"
import { useComposerCodeStore } from "@/store/composerCode"

type File = {
  id: string,
  name: string
  content: string
}

export default function Code() {
  const { files, addFile, removeFile, activeFile, setActiveFile, editFile } = useComposerCodeStore();

  const closeFile = (id: string) => {
    removeFile(id);
    if(files.length < 1) {
      setActiveFile(null);
    } else {
      setActiveFile(files[0].id);
    }
  }

  const addNewFile = () => {
    const newFile: File = {
      id: crypto.randomUUID(),
      name: `${files.length + 1}.jsx`,
      content: "",
    };
    addFile(newFile);
    setActiveFile(newFile.id);
  }

  if (files.length < 1) {
    return <></>;
  }

  const activeCode = files.find((file) => file.id === activeFile) ?? files[0];

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="flex w-full overflow-x-auto scrollbar-hide bg-card text-sm text-foreground/50">
        {files.map((file, _) => (
          <div
            key={file.id}
            onClick={() => setActiveFile(file.id)}
            className={`flex shrink-0 cursor-pointer items-center gap-2 px-3 py-3 ${activeFile === file.id
              ? "text-foreground"
              : "hover:text-pink-500"
              }`}
          >
            <div>{file.name}</div>

            <X
              size={15}
              onClick={(e) => {
                e.stopPropagation()
                closeFile(file.id)
              }}
              className="hover:text-foreground"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addNewFile}
          className="shrink-0 px-3 text-foreground/50 hover:text-foreground"
        >
          <Plus size={16} />
        </button>
      </div>

      <CodeBlockEditable
        code={activeCode.content}
        language="js"
        onChange={(e) => {
          editFile(activeFile as string, e)
        }}
      />
    </div>
  )
}