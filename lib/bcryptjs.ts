import bcrypt from "bcryptjs";

export async function generateHash(
    value: string,
    saltRounds = 12
): Promise<string> {
    return bcrypt.hash(value, saltRounds);
}

export async function compareHash(
    value: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(value, hash);
}