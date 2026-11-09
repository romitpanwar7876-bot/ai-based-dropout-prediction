
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  MessageCircle,
  Brain,
  BookOpen,
  X
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Student Prediction", icon: GraduationCap },
  { name: "Counselling", icon: Users },
  { name: "Explainability", icon: Brain },
  { name: "AI Chatbot", icon: MessageCircle },
];

function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-white
      transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 lg:static lg:flex lg:flex-col`}
    >
      <div className="flex items-center justify-between p-6 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-blue-400">
            Dropout AI
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Student Support System
          </p>
        </div>

        <button
          onClick={onClose}
          className="lg:hidden text-slate-400"
          aria-label="Close sidebar"
        >
          <X size={22} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const selected = activePage === item.name;

          return (
            <button
              key={item.name}
              onClick={() => {
                onNavigate(item.name);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl
                text-sm font-medium transition-colors
                ${selected
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <Icon size={19} />
              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="p-5 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-medium">Administrator</p>
            <p className="text-xs text-slate-400">System Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
