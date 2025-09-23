import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { geminiComplete } from "@/server/llm/gemini";
import { toGeminiContents } from "@/server/llm/map";

const ParamsSchema = z.object({
    id: z.string().min(1, "Project ID required"),
});

const BodySchema = z.object({
    content: z.string().trim().min(1, "Message cannot be empty").max(40000, "Message too long"),
});
  

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {

        const resolvedParams = await params;
        const parsed =  ParamsSchema.safeParse(resolvedParams);
        if (!parsed.success) {  
            const details = parsed.error.flatten().fieldErrors;
            return NextResponse.json(
                { error: { code: "VALIDATION_ERROR", message: "Invalid input", details } },
                { status: 400 }
            );
        }
        
        const { id } = parsed.data;
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const project = await prisma.project.findFirst({
            where: { projectId: id, userId: userId },
            select: {
                projectId: true
            }
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const messages = await prisma.message.findMany({
            where: { projectId: id },
            orderBy: [{ createdAt: "asc" }, { messageId: "asc" }],
            select: {
                messageId: true,
                role: true,
                content: true,
                createdAt: true
            }
        });
        return NextResponse.json({messages});
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> })   {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const parsed =  ParamsSchema.safeParse(resolvedParams);
        if (!parsed.success) {
            const details = parsed.error.flatten().fieldErrors;
            return NextResponse.json(
                { error: { code: "VALIDATION_ERROR", message: "Invalid input", details } },
                { status: 400 }
            );
        }

        const projectId = parsed.data.id;

        const json = await request.json().catch(() => ({}));
        const bodyParsed  = BodySchema.safeParse(json);
        if (!bodyParsed.success) {
        return NextResponse.json(
            { error: { code: "VALIDATION_ERROR", message: "Invalid input", details: bodyParsed.error.flatten().fieldErrors } },
            { status: 400 }
        );
        }

        const { content } = bodyParsed.data;

        const project = await prisma.project.findFirst({
            where: { projectId: projectId, userId: userId },
            select: { projectId: true, prompt: true },
          });
        if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
      
        const message = await prisma.message.create({
            data: {
                projectId: projectId,
                role: "user",
                content: content,
            },
            select: {
                messageId: true,
                role: true,
                content: true,
                createdAt: true
            }
        });
        
        const prior = await prisma.message.findMany({
            where: { projectId: projectId },
            orderBy: [{ createdAt: "asc" }, { messageId: "asc" }],
            select: {
                role: true,
                content: true,
            }
        });
        const contents = toGeminiContents([...prior, { role: "user", content }]);
        
        let assistantText: string;
        try {   
            assistantText = await geminiComplete({ model: "gemini-2.5-flash", systemPrompt: project.prompt?.content || "", contents });
        } catch (err) {
            return NextResponse.json(
                { message, error: "LLM failed", details: err instanceof Error ? err.message : String(err) },
                { status: 502 }
            );
        }

        const assistant = await prisma.message.create({
            data: { projectId, role: "assistant", content: assistantText },
            select: { messageId: true, role: true, content: true, createdAt: true },
        });

        return NextResponse.json({message, assistant}, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
