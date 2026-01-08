import SidebarContent from './SidebarContent';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 overflow-y-auto">
      <SidebarContent />
    </aside>
  );
}
