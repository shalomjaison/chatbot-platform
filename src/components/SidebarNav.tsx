"use client";
import { useRouter, useSearchParams} from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SidebarNav({ projects }: { projects: { id: string, name: string }[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const currentProjectId = searchParams.get("projectId");
    const [creatingProject, setCreatingProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const [newProjectPrompt, setNewProjectPrompt] = useState("");
    const [error, setError] = useState<string|null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        if (creatingProject) inputRef.current?.focus();
    }, [creatingProject]);
    
    function cancelCreate() {
        setCreatingProject(false);
        setNewProjectName("");
        setNewProjectPrompt("");
        setError(null);
    }
    
    function handleCreateProject() {
        const name = newProjectName.trim();
        const prompt = newProjectPrompt.trim() || undefined;

        if (name === "") {
            setError("Project name is required");
            return;
        }
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        setError(null);
        
        fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, prompt }),
        })
        .then(async (res) => {
            if (!res.ok) {
              const err = await res.json().catch(() => null);
              const msg =
                err?.error?.message ??
                err?.message ??
                (typeof err?.error === "string" ? err.error : null) ??
                "Failed to create project";
              throw new Error(msg);
            }
            return res.json();
        })
        .then(data => {
            if (data.error) {
                const msg = data.error.message ?? String(data.error);
                setError(msg);
                setIsSubmitting(false);
                return;
            }
            setIsSubmitting(false);
            setCreatingProject(false);
            setNewProjectName("");
            setNewProjectPrompt("");
            setError(null);
            const projectId = data.projectId ?? data.id;
            selectProject(projectId);
            router.refresh();
        })
        .catch(err => {
            setIsSubmitting(false);
            setError(err?.message || "Failed to create project");
        });

    }

    function selectProject(projectId: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("projectId", projectId);

        router.replace(`/dashboard?${params.toString()}`, {scroll: false});
    }

    return (
        <div>
            <div className="flex justify-between items-start mb-8">
                <div className="text-3xl font-light tracking-wider text-neutral-700 mb-8">PROJECTS</div>
                <button onClick={() => setCreatingProject(!creatingProject)} className="bg-neutral-900 text-white px-4 py-2 rounded-md hover:bg-neutral-700 transition-colors duration-200">+ New</button>
            </div>
            {
                creatingProject && (
                    <div className="flex flex-col gap-2 mb-8">
                        <input
                          ref={inputRef}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newProjectName.trim() && !isSubmitting) handleCreateProject();
                            if (e.key === "Escape") { cancelCreate() }
                          }}
                          type="text"
                          placeholder="Project Name"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-md border border-neutral-300"
                        />
                        <input
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newProjectName.trim() && !isSubmitting) handleCreateProject();
                            if (e.key === "Escape") { cancelCreate() }
                          }}
                          type="text"
                          placeholder="Project Prompt"
                          value={newProjectPrompt}
                          onChange={(e) => setNewProjectPrompt(e.target.value)}
                          className="w-full px-2 py-1.5 mb-1.5 rounded-md border border-neutral-300"
                        />
                        <button
                          onClick={handleCreateProject}
                          disabled={!newProjectName.trim() || isSubmitting}
                          className="disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900 bg-neutral-900 text-white px-4 py-2 rounded-md hover:bg-neutral-700 transition-colors duration-200"
                        >
                          {isSubmitting ? "Creating…" : "Create"}
                        </button>
                        {error && <div id="create-error" className="text-red-500 text-sm mb-2">{error}</div>}
                    </div>
                )
            }

            {projects.length === 0 && !creatingProject && (
              <div className="text-sm text-neutral-500 mb-4">No projects yet. Create your first one.</div>
            )}

            <ul>
                {projects.map((project) => {
                    const activeProject = currentProjectId === project.id;
                    return (
                    <li key={project.id} >
                        <button
                          onClick={() => selectProject(project.id)}
                          className={"w-full mb-5 text-left px-2 py-1.5 rounded-md hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 " + (activeProject ? "pl-4 bg-neutral-100 font-semibold border-l-2 border-neutral-900": "text-neutral-700")}
                        >
                          {project.name}
                        </button>
                    </li>);
                })}
            </ul>
        </div>
    );
}
