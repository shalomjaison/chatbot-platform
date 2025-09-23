import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ensureUser } from "@/lib/ensureUser";

const createProject = z.object({
    name: z.string().trim().min(1, "Project name is required").max(80, "Keep it under 80 chars"),
    prompt: z.string().trim().min(1, "Prompt cannot be empty").max(40000, "Prompt too long").optional(),
  });

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("GET /api/projects - Current userId:", userId);

        const projects = await prisma.project.findMany({
            where: { userId },
            select: {
                projectId: true,
                name: true,
                createdAt: true,
                userId: true
            },
            orderBy: { createdAt: "desc" }
        });

        console.log("Found projects:", projects.length, "for userId:", userId);

        const allProjects = await prisma.project.findMany({
            select: {
                projectId: true,
                name: true,
                userId: true
            }
        });
        console.log("All projects in database:", allProjects);

        return NextResponse.json({ projects });
    } catch (error) {
        console.error("GET /api/projects failed:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: {code: "UNAUTHORIZED", message: "Sign In Required"} }, { status: 401 });
        }
        await ensureUser();

        let body: unknown;
        try {
        body = await request.json();
        } catch {
        return NextResponse.json(
            { error: { code: "VALIDATION_ERROR", message: "Invalid json body" } },
            { status: 400 }
        );
        }

        const parsed = createProject.safeParse(body);
        if (!parsed.success) {
        const details = parsed.error.flatten().fieldErrors;
        return NextResponse.json(
            { error: { code: "VALIDATION_ERROR", message: "Invalid input", details } },
            { status: 400 }
        );
        }
        
        const { name, prompt } = parsed.data;
        const newProject = await prisma.project.create({
            data: {
            userId,
            name,
            prompt: { create: { content: prompt ?? "" } },
            },
            select: { projectId: true, name: true, createdAt: true }, // minimal, no userId leakage
        });

        return NextResponse.json({
            "id": newProject.projectId,
            "name": newProject.name,
            "createdAt": newProject.createdAt
        }, { status: 201 });
    } catch (error) {
        console.error("POST /api/projects failed:", error);
        return NextResponse.json({ error: { code: "INTERNAL", message: "Internal Server Error" } }, { status: 500 });
    }
}