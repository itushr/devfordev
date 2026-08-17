import { Heart, Link, MessageCircle, Share2 } from "lucide-react";

type Project = {
  name: string;
  author: string;
  comments: number;
  likes: number;
  shares: number;
};

type StatProps = {
  icon: React.ReactNode;
  value: number;
};

type ProjectItemProps = Project;

function Stat({ icon, value }: StatProps) {
  return (
    <div className="flex items-center gap-1">
      {icon}
      <span className="text-xs">{value}</span>
    </div>
  );
}

function ProjectItem({
  name,
  author,
  comments,
  likes,
  shares,
}: ProjectItemProps) {
  return (
    <div className="group cursor-pointer">
      <div className="flex items-center gap-x-2">
        <Link size={12} />

        <div className="group-hover:underline">
          {name}
        </div>

        <div className="text-muted-foreground">
          by @{author}
        </div>
      </div>

      <div className="flex items-center gap-7 pl-6 py-1">
        <Stat
          icon={<MessageCircle size={15} />}
          value={comments}
        />

        <Stat
          icon={<Heart size={15} />}
          value={likes}
        />

        <Stat
          icon={<Share2 size={15} />}
          value={shares}
        />
      </div>
    </div>
  );
}

const projects: Project[] = [
  {
    name: "devfordev.bytushar.in",
    author: "iamtushar",
    comments: 12,
    likes: 7,
    shares: 46,
  },
  {
    name: "termix.ai",
    author: "iamtushar",
    comments: 12,
    likes: 7,
    shares: 46,
  },
  {
    name: "iamtushar.in",
    author: "iamtushar",
    comments: 12,
    likes: 7,
    shares: 46,
  },
];

export default function TrendingProjects() {
  return (
    <div className="mt-5 flex flex-col gap-2">
      {projects.map((project) => (
        <ProjectItem
          key={project.name}
          {...project}
        />
      ))}
    </div>
  )
}
