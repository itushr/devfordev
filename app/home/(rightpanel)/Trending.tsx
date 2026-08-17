import TrendingProjects from "./TrendingProjects";
import TrendingTags from "./TrendingTags";

export default function Trending() {
  return (
    <div className="p-5">
      <p className="text-lg">Trending Today</p>
      <TrendingTags />
      <TrendingProjects />

    </div>
  )
}