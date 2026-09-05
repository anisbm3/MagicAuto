import { adminFetch } from "../../lib/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Car, 
  Calendar, 
  CheckCircle, 
  Clock, 
  MessageSquare,
  Droplets,
  Wrench,
  Sparkles,
  ArrowRight,
  Plus, Settings
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-[#16A34A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord</h1>
          <p className="text-gray-400">Bienvenue sur votre espace d'administration Magic Auto.</p>
        </div>
        <div className="hidden sm:flex gap-3">
          <Link to="/admin/voitures/nouveau" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Voiture
          </Link>
          <Link to="/admin/services" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Service
          </Link>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Vehicles */}
        <div className="bg-[#0B0B0B] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Car className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center text-gray-400 mb-4">
              <Car className="w-5 h-5 mr-2 text-white" />
              <span className="font-medium">Showroom</span>
            </div>
            <div className="text-4xl font-bold text-white mb-4">{stats?.vehicles?.total || 0}</div>
            <div className="flex gap-4 text-xs font-medium">
              <span className="text-[#16A34A]">{stats?.vehicles?.disponibles || 0} disp.</span>
              <span className="text-yellow-500">{stats?.vehicles?.reservees || 0} rés.</span>
              <span className="text-blue-500">{stats?.vehicles?.vendues || 0} vend.</span>
            </div>
          </div>
        </div>

        {/* Appointments */}
        <div className="bg-[#0B0B0B] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Calendar className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center text-gray-400 mb-4">
              <Calendar className="w-5 h-5 mr-2 text-[#16A34A]" />
              <span className="font-medium">Rendez-vous</span>
            </div>
            <div className="text-4xl font-bold text-white mb-4">{stats?.appointments?.total || 0}</div>
            <div className="flex gap-4 text-xs font-medium">
              <span className="text-yellow-500">{stats?.appointments?.pending || 0} attente</span>
              <span className="text-[#16A34A]">{stats?.appointments?.confirmed || 0} conf.</span>
              <span className="text-white">{stats?.appointments?.today || 0} auj.</span>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="bg-[#0B0B0B] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity flex gap-2">
            <Droplets className="w-10 h-10" />
            <Wrench className="w-10 h-10" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center text-gray-400 mb-4">
              <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
              <span className="font-medium">Services</span>
            </div>
            <div className="text-4xl font-bold text-white mb-4">{stats?.services?.total || 0}</div>
            <div className="flex gap-4 text-xs font-medium">
              <span className="text-[#16A34A]">{stats?.services?.active || 0} actifs</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-[#0B0B0B] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <MessageSquare className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center text-gray-400 mb-4">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
              <span className="font-medium">Messages</span>
            </div>
            <div className="text-4xl font-bold text-white mb-4">{stats?.messages?.unread || 0}</div>
            <div className="flex gap-4 text-xs font-medium">
              <span className="text-gray-400">Non lus</span>
            </div>
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS & RECENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-[#0B0B0B] border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-white">Rendez-vous récents</h2>
               <Link to="/admin/rendez-vous" className="text-sm text-[#16A34A] hover:underline flex items-center">Voir tout <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </div>
            {stats?.appointments?.total > 0 ? (
               <div className="flex flex-col items-center justify-center py-10 text-center">
                 <Calendar className="w-12 h-12 text-[#16A34A]/50 mb-4 opacity-80" />
                 <p className="text-gray-400">Consultez l'onglet Rendez-vous pour gérer les {stats.appointments.total} réservations.</p>
                 <Link to="/admin/rendez-vous" className="mt-4 px-6 py-2 bg-[#16A34A] text-black hover:bg-[#158f41] rounded-lg text-sm font-bold transition">Aller aux rendez-vous</Link>
              </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-10 text-center">
                 <Calendar className="w-12 h-12 text-gray-600 mb-4 opacity-50" />
                 <p className="text-gray-400">Aucun rendez-vous pour le moment.</p>
              </div>
            )}
         </div>

         <div className="bg-[#0B0B0B] border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-white">Actions Rapides</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <Link to="/admin/voitures/nouveau" className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition flex flex-col items-center justify-center text-center group">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#16A34A]/20 group-hover:text-[#16A34A] transition-colors">
                     <Car className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-white">Ajouter une voiture</span>
               </Link>
               <Link to="/admin/services" className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition flex flex-col items-center justify-center text-center group">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#16A34A]/20 group-hover:text-[#16A34A] transition-colors">
                     <Wrench className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-white">Gérer les services</span>
               </Link>
               <Link to="/admin/parametres" className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition flex flex-col items-center justify-center text-center group">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#16A34A]/20 group-hover:text-[#16A34A] transition-colors">
                     <Settings className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-white">Paramètres</span>
               </Link>
               <Link to="/" target="_blank" className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition flex flex-col items-center justify-center text-center group">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:bg-white/20 transition-colors">
                     <ArrowRight className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-white">Voir le site</span>
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
