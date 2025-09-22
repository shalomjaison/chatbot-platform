import UserMenu from "@/components/UserMenu";
import SidebarProjects from "@/components/SidebarProjects";
import MainPanel from "@/components/MainPanel";

export default async function DashboardLayout() {
    return (
        <div className="min-h-screen grid grid-rows-[auto_1fr_auto] grid-cols-[20rem_1fr] bg-neutral-100 text-neutral-900">
            <header className="col-span-2 border-b border-neutral-300 bg-white px-6 py-3 shadow-sm font-bold">
                <UserMenu />
            </header>
            <aside className="border-r border-neutral-300 bg-white p-6">
                <SidebarProjects />
            </aside>
            <main   className="bg-white p-6 rounded-tl-xl"> <MainPanel /> </main>
            <footer className="col-span-2 border-t border-neutral-300 bg-white px-6 py-3 text-neutral-600 font-bold">Footer</footer>
        </div>
    );
}