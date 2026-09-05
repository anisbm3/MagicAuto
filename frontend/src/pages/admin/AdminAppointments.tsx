import { adminFetch } from "../../lib/api";
import { useState, useEffect } from "react";
import { Search, Filter, Calendar, Clock, User, Phone, Car, CheckCircle, XCircle, Clock4, Trash2 } from "lucide-react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await adminFetch("/api/admin/appointments");
      const data = await res.json();
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = 
      app.customerName.toLowerCase().includes(search.toLowerCase()) || 
      app.customerPhone.includes(search) ||
      app.reference.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === "All" || app.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const updateStatus = async (id: number, status: string) => {
    try {
      await adminFetch(`/api/admin/appointments/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminFetch(`/api/admin/appointments/${id}`, { method: "DELETE" });
      setConfirmDelete(null);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"><Clock4 className="w-3 h-3 mr-1" /> En attente</span>;
      case 'Confirmed':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20"><CheckCircle className="w-3 h-3 mr-1" /> Confirmé</span>;
      case 'Completed':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20"><CheckCircle className="w-3 h-3 mr-1" /> Terminé</span>;
      case 'Cancelled':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20"><XCircle className="w-3 h-3 mr-1" /> Annulé</span>;
      default:
        return <span>{status}</span>;
    }
  };

  if (loading) return <div className="text-white p-8">Chargement...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Rendez-vous</h1>
        <p className="text-gray-400">Gérez vos réservations de lavage, entretien et esthétique.</p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 bg-[#0B0B0B] border border-white/5 p-4 rounded-2xl flex items-center">
          <Search className="w-5 h-5 text-gray-500 mr-3" />
          <input 
            type="text"
            placeholder="Rechercher par nom, téléphone, référence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-white focus:outline-none w-full placeholder:text-gray-600"
          />
        </div>
        <div className="bg-[#0B0B0B] border border-white/5 p-2 rounded-2xl flex items-center shrink-0 overflow-x-auto">
          <Filter className="w-5 h-5 text-gray-500 mx-3 shrink-0" />
          <div className="flex gap-2">
            {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
              <button 
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filter === s ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {s === 'All' ? 'Tous' : s === 'Pending' ? 'En attente' : s === 'Confirmed' ? 'Confirmés' : s === 'Completed' ? 'Terminés' : 'Annulés'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
           <div className="p-12 text-center bg-[#0B0B0B] border border-white/5 rounded-2xl">
             <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
             <p className="text-gray-500">Aucun rendez-vous trouvé.</p>
           </div>
        ) : (
          filteredAppointments.map(app => (
            <div key={app.id} className="bg-[#0B0B0B] border border-white/5 rounded-2xl p-6 flex flex-col lg:flex-row gap-6 lg:items-center hover:border-white/10 transition-colors">
              
              {/* Date & Time */}
              <div className="flex-shrink-0 w-32 flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5">
                <Calendar className="w-6 h-6 text-[#16A34A] mb-2" />
                <span className="text-sm font-bold text-white mb-1">
                  {new Date(app.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                </span>
                <span className="text-xl font-bold text-white">{app.time}</span>
              </div>

              {/* Info */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-1">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">{app.reference}</span>
                     {getStatusBadge(app.status)}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 flex items-center">
                    {app.serviceName || "Service Inconnu"}
                  </h3>
                  <p className="text-sm text-[#16A34A] font-bold uppercase tracking-wider">
                    {app.serviceCategory}
                  </p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p className="flex items-center text-gray-300">
                    <User className="w-4 h-4 mr-2 text-gray-500" /> <span className="font-bold text-white mr-2">{app.customerName}</span>
                  </p>
                  <p className="flex items-center text-gray-300">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" /> {app.customerPhone}
                  </p>
                  {app.vehicleBrand && (
                    <p className="flex items-center text-gray-300">
                      <Car className="w-4 h-4 mr-2 text-gray-500" /> {app.vehicleBrand} {app.vehicleModel}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex flex-row lg:flex-col gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
                {app.status === 'Pending' && (
                  <button onClick={() => updateStatus(app.id, 'Confirmed')} className="flex-1 px-4 py-2 bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 hover:bg-[#16A34A]/20 rounded-lg font-bold text-sm transition text-center">
                    Confirmer
                  </button>
                )}
                {app.status === 'Confirmed' && (
                  <button onClick={() => updateStatus(app.id, 'Completed')} className="flex-1 px-4 py-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 rounded-lg font-bold text-sm transition text-center">
                    Marquer Terminé
                  </button>
                )}
                {(app.status === 'Pending' || app.status === 'Confirmed') && (
                  <button onClick={() => updateStatus(app.id, 'Cancelled')} className="flex-1 px-4 py-2 bg-white/5 text-white hover:bg-white/10 rounded-lg font-bold text-sm transition text-center">
                    Annuler
                  </button>
                )}
                <button onClick={() => setConfirmDelete(app.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition flex items-center justify-center lg:mt-auto">
                   <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Modal Suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B0B0B] border border-white/10 rounded-2xl w-full max-w-sm p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <Trash2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Supprimer ce rendez-vous ?</h2>
            <p className="text-gray-400 mb-8 text-sm">Cette action est irréversible et supprimera l'historique de cette réservation.</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition">Annuler</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition shadow-[0_0_15px_rgba(239,68,68,0.3)]">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
