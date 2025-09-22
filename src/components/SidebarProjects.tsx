import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import SidebarNav from "./SidebarNav";
import { ensureUser } from "@/lib/ensureUser";

export default async function SidebarProjects() {
    const { userId } = await auth();
    if (!userId) {
        return <div>You must be logged in to view this page</div>
    }

    await ensureUser();

    const rows = await prisma.project.findMany({
        where: {
            userId,
        },
        select: { projectId: true, name: true},
        orderBy: { createdAt: "desc" },
    });

    const projects = rows.map((row) => ({
        id: row.projectId,
        name: row.name,
    }));

    return <SidebarNav projects={projects} />;
}