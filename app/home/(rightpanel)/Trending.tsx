import { Link } from 'lucide-react'

const Trending = () => {
  return (
    <div className="p-5">
      <p className="text-lg">Trending Today</p>
      <div className="flex flex-wrap gap-2 mt-3">
        <div className="flex items-center gap-x-2 group cursor-pointer">
          <div className="text-blue-500 group-hover:underline">#react</div>
          <div className="text-xs text-foreground/70">(432)</div>
        </div>
        <div className="flex items-center gap-x-2 group cursor-pointer">
          <div className="text-blue-500 group-hover:underline">#nextjs</div>
          <div className="text-xs text-foreground/70">(432)</div>
        </div>
        <div className="flex items-center gap-x-2 group cursor-pointer">
          <div className="text-blue-500 group-hover:underline">#typescript</div>
          <div className="text-xs text-foreground/70">(432)</div>
        </div>
        <div className="flex items-center gap-x-2 group cursor-pointer">
          <div className="text-blue-500 group-hover:underline">#programming</div>
          <div className="text-xs text-foreground/70">(432)</div>
        </div>
        <div className="flex items-center gap-x-2 group cursor-pointer">
          <div className="text-blue-500 group-hover:underline">#epress</div>
          <div className="text-xs text-foreground/70">(432)</div>
        </div>
        <div className="flex items-center gap-x-2 group cursor-pointer">
          <div className="text-blue-500 group-hover:underline">#gitngithub</div>
          <div className="text-xs text-foreground/70">(432)</div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <div className="flex items-center gap-x-2 hover:text-muted-foreground cursor-pointer">
          <Link size={12} />
          <div className="">devfordev.bytushar.in</div>
          <div className="text-muted-foreground">by @iamtushar</div>
        </div>
        <div className="flex items-center gap-x-2 hover:text-muted-foreground cursor-pointer">
          <Link size={12} />
          <div className="">termix.ai</div>
          <div className="text-muted-foreground">by @chintubadmash</div>
        </div>
        <div className="flex items-center gap-x-2 hover:text-muted-foreground cursor-pointer">
          <Link size={12} />
          <div className="">iamtushar.in</div>
          <div className="text-muted-foreground">by @tushar14</div>
        </div>
      </div>
    </div>
  )
}

export default Trending