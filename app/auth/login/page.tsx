import LoginForm from "@/components/LoginForm"
import Link from "next/link"

const page = () => {
    return (
        <>
            <div className='w-full px-10 mt-10'>
                <LoginForm />
            </div>
            <div className='w-full px-10 mt-10 font-mono'>
                First time visitor? <Link href="/auth/register" className='underline'>register</Link>
            </div>
        </>
    )
}

export default page