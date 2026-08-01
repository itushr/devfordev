const Separator = () => {
    return (
        <div
            className="h-5"
            style={{
                backgroundColor: 'var(--background)',
                backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 4px, var(--border) 4px, var(--border) 5px)`,
            }}
        />
    )
}

export default Separator