const options = [{
    text: "Home"
}, {
    text: "Notification"
}, {
    text: "Bookmarks"
}, {
    text: "Profile"
}, {
    text: "Setting"
}]

const Sidebar = () => {
    return (
        <div className="w-full">
            <div className="w-full rounded-l-2xl py-5 px-10 h-10"></div>
            {options.map((item, index) => (
                <div className="w-full rounded-l-2xl py-5 px-10" style={{ backgroundColor: index == 0 ? "var(--background)" : "" }}>{item.text}</div>
            ))}
        </div>
    )
}

export default Sidebar