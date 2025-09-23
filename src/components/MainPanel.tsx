"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";



interface Message {
    messageId: string;
    content: string;
    role: "user" | "assistant";
    createdAt: string;
}

interface Project {
    projectId: string;
    name: string;
    userId: string;
}

export default function MainPanel() {
    const searchParams = useSearchParams();
    const currentProjectId = searchParams.get("projectId");
    const [input, setInput] = useState<string>("");
    const [sending, setSending] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [projectName, setProjectName] = useState<string>("");
    const endRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (!currentProjectId) return;
        (async () => {
          // Fetch project info and messages in parallel
          const [projectRes, messagesRes] = await Promise.all([
            fetch(`/api/projects`),
            fetch(`/api/projects/${currentProjectId}/messages`)
          ]);

          if (projectRes.ok) {
            const projectData = await projectRes.json();
            const project = projectData.projects.find((p: Project) => p.projectId === currentProjectId);
            if (project) {
              setProjectName(project.name);
            }
          }

          if (!messagesRes.ok) {
            console.log("Error fetching messages:", messagesRes.status, messagesRes.statusText);
            const errorText = await messagesRes.text();
            console.log("Error response:", errorText);
            return;
          }
          console.log("Messages fetched successfully");
          const data = await messagesRes.json();
          setMessages(data.messages);
          endRef.current?.scrollIntoView({ behavior: "smooth" });
        })();
    }, [currentProjectId]);

    if (!currentProjectId) {
        return  (<div className="h-full flex flex-col justify-start items-center pt-12">
                    <div className="text-center max-w-lg border rounded-xl p-6 bg-neutral-50">
                        <div className="text-2xl font-semibold mb-1">Welcome to the Chatbot Platform!</div>
                        <p className="text-sm text-neutral-600">Create or Choose a project from the left to start chatting with your AI agent.</p>
                    </div>
                </div>);
    }


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!input.trim()) return;
        const sentContent = input.trim();
        setInput("");
        setSending(true);
        
        try {
            console.log("Sending message:", sentContent);
            console.log("Current project ID:", currentProjectId);
            const res = await fetch(`/api/projects/${currentProjectId}/messages`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ content: sentContent }),
            });
             if (!res.ok) {
                 console.log("Error sending message:", res.status, res.statusText);
                 const errorText = await res.text();
                 console.log("Error response:", errorText);
                 return;
             }
            console.log("Message sent successfully");
            const { message, assistant } = await res.json();
            setMessages((m) => [...m, message, assistant]);
            endRef.current?.scrollIntoView({ behavior: "smooth" });
          } finally {
            setSending(false);
          }
    }


    return (
    <div className="h-full flex flex-col">
        {/* Agent Title Area */}
        <div className="sticky z-10 top-0 border-b bg-white/80 backdrop-blur px-4 py-2">
                <div className="text-lg text-neutral-500">Project</div>
                <div className="text-2xl font-semibold">{projectName || "Loading..."}</div>
        </div>
        
        {/* Message Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
            {messages.map((message) => (
                <div key={message.messageId} className="flex flex-col mb-4">
                    <div className={"px-3 py-2 rounded-2xl text-lg text-neutral-700 max-w-xs " + (message.role === "user" ? "ml-auto text-right bg-neutral-900 text-white" : "mr-auto bg-neutral-300 text-neutral-900")}>{message.content}</div>
                </div>
            ))}
            <div ref={endRef} />
        </div>
        {sending && <div className="px-4 py-2 rounded-b-xl bg-neutral-100">
            <div className="text-lg text-neutral-500">Assistant is thinking...</div>
        </div>}
        {/* Message Input Area */}
        <div className="sticky z-10 bottom-0 border-t bg-white/80 px-3 py-4 pb-0">
            <form className="flex flex-row justify-between items-center gap-2" onSubmit={handleSubmit}>
                <input type="text" placeholder="Type your message here..." className="flex-1 rounded-3xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300" value={input} onChange={(e) => setInput(e.target.value)} disabled={sending}/>
                <button type="submit" disabled={sending || !input.trim()} className="rounded-md hover:cursor-pointer hover:bg-neutral-400 p-2 transition-colors duration-200">Send</button>
            </form>
        </div>
    </div>);
}
