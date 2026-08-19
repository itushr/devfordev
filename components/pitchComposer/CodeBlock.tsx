export default function CodeBlock({ code }: { code: string }) {
    const handleInput = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const value = e.target.value;

        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };


    return (
        <div className="border rounded-md pl-5 py-3 mt-3">
            <textarea
                placeholder="paste code here..."
                defaultValue={code}
                spellCheck={false}
                onChange={handleInput}
                rows={1}
                className="w-full resize-none border-none outline-none whitespace-nowrap scrollbar-none"
            />
        </div>
    )
}
