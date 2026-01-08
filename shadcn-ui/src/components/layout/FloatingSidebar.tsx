import SidebarContent from './SidebarContent';

export default function FloatingSidebar() {
    return (
        <aside className="hidden md:block w-72 fixed left-4 top-4 bottom-4 z-30">
            <div className="h-full bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-emerald-900/5">
                <SidebarContent />
            </div>
        </aside>
    );
}
