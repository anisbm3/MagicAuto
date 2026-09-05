import { adminFetch } from "../../lib/api";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  MessageSquare, 
  Star, 
  Settings, 
  LogOut,
  Droplets,
  Wrench,
  Sparkles,
  Menu,
  X,
  Users
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{username: string, role: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth
    adminFetch('/api/admin/me')
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(data => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        navigate('/admin/login');
      });
  }, [navigate]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await adminFetch('/api/admin/logout', { method: 'POST' });
      try { localStorage.removeItem('admin_token'); } catch(e) {} (window as any).__ADMIN_TOKEN__ = null;
      navigate('/admin/login');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#16A34A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Tableau de bord", exact: true },
    { path: "/admin/voitures", icon: Car, label: "Voitures" },
    { path: "/admin/rendez-vous", icon: Calendar, label: "Rendez-vous" },
    
    // Services Sub-menu conceptually
    { path: "/admin/services", icon: Settings, label: "Services (Tous)" },
    { path: "/admin/lavage", icon: Droplets, label: "Lavage", sub: true },
    { path: "/admin/entretien", icon: Wrench, label: "Entretien", sub: true },
    { path: "/admin/esthetique", icon: Sparkles, label: "Esthétique", sub: true },
    
    { path: "/admin/messages", icon: MessageSquare, label: "Messages" },
    { path: "/admin/avis", icon: Star, label: "Avis clients" },
  ];

  if (user?.role === 'SUPER_ADMIN') {
     menuItems.push({ path: "/admin/utilisateurs", icon: Users, label: "Utilisateurs" });
  }

  menuItems.push({ path: "/admin/parametres", icon: Settings, label: "Paramètres" });

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0B0B0B] border-r border-white/5 w-64 text-gray-300">
      <div className="p-6">
        <Link to="/" className="text-xl font-bold text-white tracking-wider flex items-center">
          <span className="text-[#16A34A] mr-2">MAGIC</span> AUTO
        </Link>
        <div className="mt-4 px-3 py-2 bg-white/5 rounded-lg border border-white/5 flex items-center">
           <div className="w-8 h-8 bg-[#16A34A]/20 rounded-full flex items-center justify-center mr-3 text-[#16A34A] font-bold">
             {user?.username.charAt(0).toUpperCase()}
           </div>
           <div>
             <p className="text-xs font-bold text-white">{user?.username}</p>
             <p className="text-[10px] uppercase text-gray-500">{user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}</p>
           </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  active 
                    ? "bg-[#16A34A]/10 text-[#16A34A] font-medium" 
                    : "hover:bg-white/5 hover:text-white"
                } ${item.sub ? "ml-6 text-sm" : ""}`}
              >
                <Icon className={`w-5 h-5 mr-3 ${active ? "text-[#16A34A]" : "text-gray-500"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed inset-y-0 left-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-64 max-w-sm bg-[#0B0B0B] h-full shadow-2xl flex-col flex animate-in slide-in-from-left duration-300">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 bg-[#0B0B0B] border-b border-white/5 sticky top-0 z-40">
          <Link to="/admin" className="text-xl font-bold text-white tracking-wider">
            <span className="text-[#16A34A]">MAGIC</span> ADMIN
          </Link>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
