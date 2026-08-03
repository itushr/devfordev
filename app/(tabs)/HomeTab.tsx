import Pitch from "@/components/Pitch"

const HomeTab = () => {
  return (
    <div className='w-full max-w-260 mx-auto h-fit flex justify-between'>
      <div className="w-150 py-15 border">
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
        <Pitch />
      </div>
      <div className="w-100 border-x py-15">
        <div className="h-120 border-y p-2" style={{
          backgroundColor: 'var(--background)',
          backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 4px, var(--border) 4px, var(--border) 5px)`,
        }}>
          <div className="h-full w-full bg-background rounded-2xl"></div>
        </div>

        <div className="h-120 mt-2 border-y p-2" style={{
          backgroundColor: 'var(--background)',
          backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 4px, var(--border) 4px, var(--border) 5px)`,
        }}>
          <div className="h-full w-full bg-background rounded-2xl"></div>
        </div>
      </div>
    </div>
  )
}

export default HomeTab