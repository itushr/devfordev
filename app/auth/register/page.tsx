import RegistrationForm from "./RegistrationForm"
import Link from "next/link"

const page = () => {
    return (
        <>
            <div className='w-full md:px-10 mt-10'>
                <RegistrationForm />
            </div>
            <div className='w-full md:px-10 mt-10'>
                Already a member? <Link href="/auth/login" className='underline focus:px-2 focus:py-1'>login</Link>
            </div>
        </>
    )
}

export default page