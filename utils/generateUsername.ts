type Params = {
    name?: string | null;
    email?: string;
};

export function generateUsername({
    name,
    email,
}: Params): string {
    const baseUsername =
        name?.trim()
            ? name.replace(/\s+/g, "").toLowerCase()
            : email?.split("@")[0].toLowerCase() ?? "user";

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    return `${baseUsername}_${randomSuffix}`;
}