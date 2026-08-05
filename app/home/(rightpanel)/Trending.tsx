import { Heart, Link, MessageCircle, Share2 } from 'lucide-react'

const Trending = () => {
  return (
    <div className="p-5">
      <p className="text-lg">Trending Today</p>
      <div className="flex flex-wrap gap-x-2 gap-y-0 mt-3">
        <div className="flex items-center gap-x-1 group cursor-pointer">
          <div className="text-blue-500 group-hover:underline">#react</div>
          <div className="text-xs text-foreground/70 group-hover:underline">(432)</div>
        </div>
        <div className="flex items-center gap-x-1 group cursor-pointer">
          <div className="text-blue-500 group-hover:underline">#nextjs</div>
          <div className="text-xs text-foreground/70 group-hover:underline">(432)</div>
        </div>
        <div className="flex items-center gap-x-1 group cursor-pointer">
          <div className="text-blue-500 group-hover:underline">#typescript</div>
          <div className="text-xs text-foreground/70 group-hover:underline">(432)</div>
        </div>
        <div className="flex items-center gap-x-1 group cursor-pointer">
          <div className="text-blue-500 group-hover:underline">#programming</div>
          <div className="text-xs text-foreground/70 group-hover:underline">(432)</div>
        </div>
        <div className="flex items-center gap-x-1 group cursor-pointer">
          <div className="text-blue-500 group-hover:underline">#epress</div>
          <div className="text-xs text-foreground/70 group-hover:underline">(432)</div>
        </div>
        <div className="flex items-center gap-x-1 group cursor-pointer">
          <div className="text-blue-500 group-hover:underline">#gitngithub</div>
          <div className="text-xs text-foreground/70 group-hover:underline">(432)</div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <div className="group cursor-pointer">
          <div className="flex items-center gap-x-2">
            <Link size={12} />
            <div className="group-hover:underline">devfordev.bytushar.in</div>
            <div className="text-muted-foreground">by @iamtushar</div>
          </div>
          <div className="flex items-center gap-7 pl-6 py-1">
            <div className="flex items-center gap-1">
              <MessageCircle size={12} /><span className="text-xs">12</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={12} /><span className="text-xs">7</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 size={12} /><span className="text-xs">46</span>
            </div>
          </div>
        </div>
        <div className="group cursor-pointer">
          <div className="flex items-center gap-x-2">
            <Link size={12} />
            <div className="group-hover:underline">termix.ai</div>
            <div className="text-muted-foreground">by @chintubadmash</div>
          </div>
          <div className="flex items-center gap-7 pl-6 py-1">
            <div className="flex items-center gap-1">
              <MessageCircle size={12} /><span className="text-xs">12</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={12} /><span className="text-xs">7</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 size={12} /><span className="text-xs">46</span>
            </div>
          </div>
        </div>
        <div className="group cursor-pointer">
          <div className="flex items-center gap-x-2">
            <Link size={12} />
            <div className="group-hover:underline">iamtushar.in</div>
            <div className="text-muted-foreground">by @tushar14</div>
          </div>
          <div className="flex items-center gap-7 pl-6 py-1">
            <div className="flex items-center gap-1">
              <MessageCircle size={12} /><span className="text-xs">12</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={12} /><span className="text-xs">7</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 size={12} /><span className="text-xs">46</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Trending