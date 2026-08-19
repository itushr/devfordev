"use client"

import { CheckIcon, CopyIcon } from "lucide-react"
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { type BundledLanguage, codeToHtml, type ShikiTransformer } from "shiki"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CodeBlockProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  code: string
  language: BundledLanguage
  showLineNumbers?: boolean
  readOnly?: boolean
  onChange?: (value: string) => void
}

interface CodeBlockContextType {
  code: string
}

const CodeBlockContext = createContext<CodeBlockContextType>({
  code: "",
})

const lineNumberTransformer: ShikiTransformer = {
  name: "line-numbers",
  line(node, line) {
    node.children.unshift({
      type: "element",
      tagName: "span",
      properties: {
        className: [
          "inline-block",
          "min-w-10",
          "mr-4",
          "text-right",
          "select-none",
          "text-muted-foreground",
        ],
      },
      children: [{ type: "text", value: String(line) }],
    })
  },
}

export async function highlightCode(
  code: string,
  language: BundledLanguage,
  showLineNumbers = false,
) {
  // Ensure trailing empty lines render with proper height
  const codeToHighlight = code.endsWith("\n") ? code : code + "\n"
  const transformers: ShikiTransformer[] = showLineNumbers ? [lineNumberTransformer] : []

  return await Promise.all([
    codeToHtml(codeToHighlight, {
      lang: language,
      theme: "one-light",
      transformers,
    }),
    codeToHtml(codeToHighlight, {
      lang: language,
      theme: "one-dark-pro",
      transformers,
    }),
  ])
}

export const CodeBlockEditable = ({
  code: externalCode,
  language,
  showLineNumbers = false,
  readOnly = false,
  onChange,
  className,
  children,
  ...props
}: CodeBlockProps) => {
  const [internalCode, setInternalCode] = useState(externalCode)
  const [html, setHtml] = useState<string>("")
  const [darkHtml, setDarkHtml] = useState<string>("")

  const lightRef = useRef<HTMLDivElement>(null)
  const darkRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Keep internal state updated when the external code prop changes
  useEffect(() => {
    setInternalCode(externalCode)
  }, [externalCode])

  // Re-run Shiki highlighting whenever internalCode changes
  useEffect(() => {
    let active = true

    highlightCode(internalCode, language, showLineNumbers).then(([light, dark]) => {
      if (active) {
        setHtml(light)
        setDarkHtml(dark)
      }
    })

    return () => {
      active = false
    }
  }, [internalCode, language, showLineNumbers])

  const handleTextChange = (value: string) => {
    setInternalCode(value)
    onChange?.(value)
  }

  // Handle Tab key insertion inside the editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      const newCode = internalCode.substring(0, start) + "  " + internalCode.substring(end)
      handleTextChange(newCode)

      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      })
    }
  }

  // Sync scroll positions between the textarea and both light/dark code blocks
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget
    if (lightRef.current) {
      lightRef.current.scrollTop = scrollTop
      lightRef.current.scrollLeft = scrollLeft
    }
    if (darkRef.current) {
      darkRef.current.scrollTop = scrollTop
      darkRef.current.scrollLeft = scrollLeft
    }
  }

  return (
    <CodeBlockContext.Provider value={{ code: internalCode }}>
      <div
        className={cn(
          "group relative w-full overflow-hidden bg-background text-foreground font-mono text-sm",
          className,
        )}
        {...props}
      >
        <div className="relative min-h-50 w-full">
          {/* Light Theme Highlight Layer (One Light) */}
          <div
            ref={lightRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-auto dark:hidden [&>pre]:m-0 [&>pre]:bg-background! [&>pre]:p-4 [&>pre]:text-foreground! [&>pre]:text-sm [&>pre]:leading-relaxed [&_code]:font-mono [&_code]:text-sm"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Dark Theme Highlight Layer (One Dark Pro) */}
          <div
            ref={darkRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden overflow-auto dark:block [&>pre]:m-0 [&>pre]:bg-background! [&>pre]:p-4 [&>pre]:text-foreground! [&>pre]:text-sm [&>pre]:leading-relaxed [&_code]:font-mono [&_code]:text-sm"
            dangerouslySetInnerHTML={{ __html: darkHtml }}
          />

          {/* Editable Transparent Textarea Overlay */}
          <textarea
            ref={textareaRef}
            value={internalCode}
            readOnly={readOnly}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className={cn(
              "absolute inset-0 h-full w-full resize-none overflow-auto bg-transparent p-4 font-mono text-sm leading-relaxed text-transparent caret-foreground outline-none border-none ring-0 focus:outline-none focus:ring-0 whitespace-pre",
              readOnly && "pointer-events-none"
            )}
            style={{
              WebkitTextFillColor: "transparent",
            }}
          />

          {children && (
            <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
              {children}
            </div>
          )}
        </div>
      </div>
    </CodeBlockContext.Provider>
  )
}

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void
  onError?: (error: Error) => void
  timeout?: number
}

export const CodeBlockCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const { code } = useContext(CodeBlockContext)

  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
      onError?.(new Error("Clipboard API not available"))
      return
    }

    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      onCopy?.()
      setTimeout(() => setIsCopied(false), timeout)
    } catch (error) {
      onError?.(error as Error)
    }
  }

  const Icon = isCopied ? CheckIcon : CopyIcon

  return (
    <Button
      className={cn("shrink-0", className)}
      onClick={copyToClipboard}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <Icon size={14} />}
    </Button>
  );
}