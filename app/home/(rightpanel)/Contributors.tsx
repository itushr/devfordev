import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";

type Contributor = {
  name: string;
  username: string;
  contributions: number;
};

const contributors: Contributor[] = [
  {
    name: "Tushar",
    username: "@iamtushar",
    contributions: 12,
  },
  {
    name: "Tushar",
    username: "@iamtushar",
    contributions: 12,
  },
  {
    name: "Tushar",
    username: "@iamtushar",
    contributions: 12,
  },
];

const Contributors = () => {
  return (
    <div className="p-5">
      <p className="text-lg">Today's Contributors</p>

      <div className="flex flex-col gap-5 mt-5">
        {contributors.map((contributor, index) => (
          <div
            key={`${contributor.username}-${index}`}
            className="flex justify-between items-center"
          >
            <div className="flex items-center gap-x-3 cursor-pointer">
              <Avatar />

              <div>
                <p>
                  {contributor.name}{" "}
                  <span className="text-muted-foreground text-sm">
                    {contributor.username}
                  </span>
                </p>

                <p className="text-sm">
                  <span className="text-xs">
                    {contributor.contributions}
                  </span>{" "}
                  contributions
                </p>
              </div>
            </div>

            <Button className="rounded-full text-sm px-5 py-4">
              Follow
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contributors;