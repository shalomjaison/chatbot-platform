import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function ensureUser() {
    const user = await currentUser();
    if (!user) {
        throw new Error("No signed-in user found when calling ensureUser()");
    }
    const userId = user?.id;
    const email = user?.emailAddresses[0].emailAddress;

    await prisma.user.upsert({
        where: { userId },
        update: {},
        create: { userId, email },
    });
}