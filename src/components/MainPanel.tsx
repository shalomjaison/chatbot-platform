    "use client";

    import { useSearchParams } from "next/navigation";

    export default function MainPanel() {
        const searchParams = useSearchParams();
        const currentProjectId = searchParams.get("projectId");

        const messages = [
            {
                messageId: 1,
                content: "Hello!",
                role: "user",
                createdAt: new Date(2025, 9, 22, 10, 0, 0)
            },
            {
                messageId: 2,
                content: "Hey there!",
                role: "assistant",
                createdAt: new Date(2025, 9, 22, 10, 0, 1)
            }
        ]


        if (!currentProjectId) {
            return  (<div className="h-full flex flex-col justify-start items-center pt-12">
                        <div className="text-center max-w-lg border rounded-xl p-6 bg-neutral-50">
                            <div className="text-2xl font-semibold mb-1">Welcome to the Chatbot Platform!</div>
                            <p className="text-sm text-neutral-600">Create or Choose a project from the left to start chatting with your AI agent.</p>
                        </div>
                    </div>);
        }

        return (
        <div className="h-full flex flex-col">
            {/* Agent Title Area */}
            <div className="sticky z-10 top-0 border-b bg-white/80 backdrop-blur px-4 py-2">
                    <div className="text-lg text-neutral-500">Project</div>
                    <div className="text-2xl font-semibold">Alpha</div>
            </div>
            
            {/* Message Scroll Area */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
                {messages.map((message) => (
                    <div key={message.messageId} className="flex flex-col mb-4">
                        <div className={"px-3 py-2 rounded-2xl text-lg text-neutral-700 max-w-xs " + (message.role === "user" ? "ml-auto text-right bg-neutral-900 text-white" : "mr-auto bg-neutral-300 text-neutral-900")}>{message.content}</div>
                    </div>
                ))}
            </div>

            {/* Message Input Area */}
            <div className="sticky z-10 bottom-0 border-t bg-white/80 px-3 py-4 pb-0">
                <form className="flex flex-row justify-between items-center gap-2" onSubmit={(e) => e.preventDefault()}>
                    <input type="text" placeholder="Type your message here..." className="flex-1 rounded-3xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"/>
                    <button className="rounded-md hover:cursor-pointer hover:bg-neutral-400 p-2 transition-colors duration-200">Send</button>
                </form>
            </div>
        </div>);
    }
