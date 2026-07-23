import RegistrationForm from "@/components/RegistrationForm"
import Link from "next/link"

const page = () => {
    return (
        <>
            <div className='w-full px-10 mt-10'>
                <RegistrationForm />
            </div>
            <div className='w-full px-10 mt-10 font-mono'>
                Already a member? <Link href="/auth/login" className='underline'>login</Link>
            </div>
        </>
    )
}

export default page