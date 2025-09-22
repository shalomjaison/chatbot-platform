"use client";
import { useRouter, useSearchParams} from "next/navigation";

export default function SidebarNav({ projects }: { projects: { id: string, name: string }[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentProjectId = searchParams.get("projectId");
    
    function selectProject(projectId: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("projectId", projectId);

        router.replace(`/dashboard?${params.toString()}`, {scroll: false});
    }

    if (projects.length === 0) {
        return (
            <div className="border-r border-neutral-300 bg-white p-6">
                <div className="text-3xl font-light tracking-wider text-neutral-700 mb-8">PROJECTS</div>
                <div className="text-sm text-neutral-500">No projects found</div>
            </div>
        );
    }

    return (
        <div>
            <div className="text-3xl font-light tracking-wider text-neutral-700 mb-8">PROJECTS</div>
            <ul>
                {projects.map((project) => {
                    const activeProject = currentProjectId === project.id;
                    return (
                    <li key={project.id} >
                        <button onClick={() => selectProject(project.id)} className={"w-full mb-5 text-left px-2 py-1.5 rounded-md hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 " + (activeProject ? "pl-4 bg-neutral-100 font-semibold border-l-2 border-neutral-900": "text-neutral-700")}>{project.name}</button>
                    </li>);
                })}
            </ul>
        </div>
    );
}
