import Profile from "./Profile"
import Logo from "./Logo"
import Menu from "./Menu"

const Sidebar = ({ active }: { active: string }) => {
    return (
        <div className="border-r w-70 bg-background relative">
            <Logo />
            <Menu active={active} />
            <Profile />
        </div>
    )
}

export default Sidebar