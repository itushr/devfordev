import { Elsie } from "next/font/google"

const elsie = Elsie({
    weight: '400',
    subsets: ['latin'],
    display: 'swap'
})

const Logo = () => {
    return (
        <div className={`px-5 h-15 flex items-center text-3xl font-mono font-semibold border-b ${elsie.className}`}>devfordev</div>
    )
}

export default Logo