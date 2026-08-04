import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { menuOptions } from "./menuOptions"

const Menu = ({ active }: { active: string }) => {
    return (
        <div className="px-5 py-5 flex flex-col hover:text-foreground/50">
            {
                menuOptions.map((item, index) => (
                    <Link key={index} href={item.link} >
                        <div className="py-2 px-7 flex relative gap-2 font-mono tracking-wide hover:text-foreground cursor-pointer font-semibold">
                            {item.text == active &&
                                <div className="absolute left-0">
                                    <ChevronRight />
                                </div>}
                            {item.text}
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

export default Menu