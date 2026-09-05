import { adminFetch } from "../../lib/api";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Eye, MapPin, Fuel, Gauge, Car, Wrench, Calendar as CalIcon } from "lucide-react";

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await adminFetch("/api/admin/vehicles");
      const data = await res.json();
      setVehicles(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = 
      v.brand.toLowerCase().includes(search.toLowerCase()) || 
      v.model.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || v.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: number) => {
    try {
      await adminFetch(`/api/admin/vehicles/${id}`, { method: "DELETE" });
      setConfirmDelete(null);
      fetchVehicles();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Disponible':
        return <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#16A34A] text-black">Disponible</span>;
      case 'Réservée':
        return <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-500 text-black">Réservée</span>;
      case 'Vendue':
        return <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500 text-white">Vendue</span>;
      default:
        return <span>{status}</span>;
    }
  };

  if (loading) return <div className="text-white p-8">Chargement...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Showroom</h1>
          <p className="text-gray-400">Gérez l'inventaire des véhicules en vente.</p>
        </div>
        <Link 
          to="/admin/voitures/nouveau"
          className="px-6 py-3 bg-[#16A34A] text-[#050505] font-bold rounded-xl hover:bg-[#158f41] transition flex items-center shadow-[0_0_15px_rgba(22,163,74,0.3)]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter une voiture
        </Link>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 bg-[#0B0B0B] border border-white/5 p-4 rounded-2xl flex items-center">
          <Search className="w-5 h-5 text-gray-500 mr-3" />
          <input 
            type="text"
            placeholder="Rechercher par marque, modèle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-white focus:outline-none w-full placeholder:text-gray-600"
          />
        </div>
        <div className="bg-[#0B0B0B] border border-white/5 p-2 rounded-2xl flex items-center shrink-0 overflow-x-auto">
          <div className="flex gap-2 px-2">
            {['All', 'Disponible', 'Réservée', 'Vendue'].map(s => (
              <button 
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filter === s ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {s === 'All' ? 'Tous' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-[#0B0B0B] border border-white/5 rounded-2xl">
            <Car className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
            <p className="text-gray-500">Aucun véhicule trouvé.</p>
            <Link to="/admin/voitures/nouveau" className="mt-4 inline-block px-6 py-2 bg-white/5 text-white hover:bg-white/10 rounded-lg transition">
              Ajouter le premier véhicule
            </Link>
          </div>
        ) : (
          filteredVehicles.map(v => (
            <div key={v.id} className="bg-[#0B0B0B] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 transition flex flex-col">
              <div className="relative h-48 overflow-hidden bg-[#111]">
                {v.images && v.images.split(',')[0] ? (
                  <img src={v.images.split(',')[0]} alt={v.model} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Car className="w-12 h-12 text-white/10" /></div>
                )}
                <div className="absolute top-3 right-3">
                  {getStatusBadge(v.status)}
                </div>
                {v.featured && (
                  <div className="absolute top-3 left-3 bg-purple-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                    À la une
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{v.brand}</p>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white leading-tight pr-4">{v.model}</h3>
                  <p className="text-xl font-bold text-[#16A34A] whitespace-nowrap">{v.price.toLocaleString('fr-FR')} TND</p>
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-400 mb-6">
                  <div className="flex items-center">
                    <CalIcon className="w-4 h-4 mr-2 opacity-50" /> {v.year}
                  </div>
                  <div className="flex items-center">
                    <Gauge className="w-4 h-4 mr-2 opacity-50" /> {v.mileage.toLocaleString('fr-FR')} km
                  </div>
                  <div className="flex items-center">
                    <Fuel className="w-4 h-4 mr-2 opacity-50" /> {v.fuel}
                  </div>
                  <div className="flex items-center">
                    <Wrench className="w-4 h-4 mr-2 opacity-50" /> {v.transmission}
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
                  <Link 
                    to={`/voitures/${v.slug}`} 
                    target="_blank"
                    className="flex-1 px-2 py-2 bg-white/5 text-white hover:bg-white/10 rounded-lg transition text-sm font-medium flex items-center justify-center"
                    title="Voir sur le site"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link 
                    to={`/admin/voitures/${v.id}`}
                    className="flex-1 px-4 py-2 bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 hover:bg-[#16A34A]/20 rounded-lg transition text-sm font-bold flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-2" /> Modifier
                  </Link>
                  <button 
                    onClick={() => setConfirmDelete(v.id)}
                    className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
            <h2 className="text-xl font-bold text-white mb-2">Supprimer ce véhicule ?</h2>
            <p className="text-gray-400 mb-8 text-sm">Cette action est irréversible. Le véhicule sera retiré de la vitrine.</p>
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
