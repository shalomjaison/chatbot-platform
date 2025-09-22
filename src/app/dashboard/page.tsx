import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const { userId, sessionId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const user = await currentUser();
    const primaryEmail = user?.emailAddresses[0]?.emailAddress ?? "—";
    
    return (
        <div className="p-6 max-w-2xl space-y-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div className="rounded-lg border border-gray-500 p-4">
                <p className="text-sm opacity-70">Server Session Proof:</p>
                <ul className="mt-2 space-y-1 text-lg">
                    <li><span className="font-medium">userId:</span> {userId}</li>
                    <li><span className="font-medium">email:</span> {primaryEmail}</li>
                    <li><span className="font-medium">sessionId:</span> {sessionId}</li>
                </ul>
            </div>
        </div>
    );
}
