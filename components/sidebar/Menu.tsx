import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { menuOptions } from "./menuOptions"

const Menu = ({ active }: { active: string }) => {
    return (
        <div className="px-5 py-5 flex flex-col hover:text-foreground/50">
            {
                menuOptions.map((item, index) => (
                    <Link key={index} href={item.link} >
                        <div className="py-2 px-7 flex relative gap-2 font-mono tracking-wide hover:text-foreground cursor-pointer text-lg">
                            {item.text == active ?
                                <>
                                    <div className="absolute left-0">
                                        <ChevronRight />
                                    </div>
                                    <span className="lowercase">
                                        ~/{item.text}
                                    </span>
                                </>
                                :
                                <span className="lowercase text-foreground/50 hover:text-foreground">
                                    ~/{item.text}
                                </span>
                            }
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

export default Menu