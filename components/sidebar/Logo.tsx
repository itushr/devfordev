import { Sora } from "next/font/google"

const sora = Sora({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800']
})

const Logo = () => {
    return (
        <div className={`px-5 h-15 flex items-center text-2xl border-b ${sora.className}`}>devfordev</div>
    )
}

export default Logo