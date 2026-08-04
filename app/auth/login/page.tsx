import LoginForm from "./LoginForm"
import Link from "next/link"

const page = () => {
    return (
        <>
            <div className='w-full md:px-10 mt-10'>
                <LoginForm />
            </div>
            <div className='w-full md:px-10 mt-10'>
                First time visitor? <Link href="/auth/register" className='underline focus:px-2 focus:py-1'>register</Link>
            </div>
        </>
    )
}

export default page