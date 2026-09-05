import { adminFetch } from "../../lib/api";
import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

export default function AdminServices({ category = "" }) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    category: category || "Lavage",
    description: "",
    price: "",
    duration: "",
    image: "",
    active: true,
    featured: false
  });

  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchServices();
  }, [category]);

  const fetchServices = async () => {
    try {
      const res = await adminFetch("/api/admin/services");
      const data = await res.json();
      if (category) {
        setServices(data.filter((s: any) => s.category === category));
      } else {
        setServices(data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/admin/services/${currentId}` : "/api/admin/services";
      const method = isEditing ? "PUT" : "POST";
      
      const payload = {
        ...formData,
        price: formData.price ? parseInt(formData.price as string) : null
      };

      await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      setShowModal(false);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminFetch(`/api/admin/services/${id}`, { method: "DELETE" });
      setConfirmDelete(null);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (service: any) => {
    try {
      await adminFetch(`/api/admin/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...service, active: !service.active })
      });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const openNewModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: "",
      category: category || "Lavage",
      description: "",
      price: "",
      duration: "",
      image: "",
      active: true,
      featured: false
    });
    setShowModal(true);
  };

  const openEditModal = (service: any) => {
    setIsEditing(true);
    setCurrentId(service.id);
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      price: service.price ? service.price.toString() : "",
      duration: service.duration || "",
      image: service.image || "",
      active: service.active,
      featured: service.featured
    });
    setShowModal(true);
  };

  if (loading) return <div className="text-white p-8">Chargement...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {category ? `Services : ${category}` : "Tous les services"}
          </h1>
          <p className="text-gray-400">Gérez les prestations proposées à vos clients.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="px-6 py-3 bg-[#16A34A] text-[#050505] font-bold rounded-xl hover:bg-[#158f41] transition flex items-center shadow-[0_0_15px_rgba(22,163,74,0.3)]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un service
        </button>
      </div>

      <div className="bg-[#0B0B0B] border border-white/5 p-4 rounded-2xl mb-8 flex items-center">
        <Search className="w-5 h-5 text-gray-500 mr-3" />
        <input 
          type="text"
          placeholder="Rechercher un service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none text-white focus:outline-none w-full placeholder:text-gray-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredServices.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-[#0B0B0B] border border-white/5 rounded-2xl">
            <p className="text-gray-500">Aucun service trouvé dans cette catégorie.</p>
            <button onClick={openNewModal} className="mt-4 px-6 py-2 bg-white/5 text-white hover:bg-white/10 rounded-lg transition">
              Créer le premier service
            </button>
          </div>
        ) : (
          filteredServices.map(service => (
            <div key={service.id} className="bg-[#0B0B0B] border border-white/5 rounded-2xl overflow-hidden group hover:border-[#16A34A]/50 transition-colors">
              {service.image && (
                <div className="h-40 overflow-hidden relative">
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white border border-white/10">
                    {service.category}
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white line-clamp-1">{service.name}</h3>
                  <button onClick={() => toggleStatus(service)} title={service.active ? "Désactiver" : "Activer"}>
                    {service.active ? (
                      <CheckCircle className="w-6 h-6 text-[#16A34A]" />
                    ) : (
                      <XCircle className="w-6 h-6 text-gray-600" />
                    )}
                  </button>
                </div>
                
                {!service.image && (
                  <p className="text-xs font-bold text-[#16A34A] uppercase tracking-wider mb-2">{service.category}</p>
                )}

                <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{service.description}</p>
                
                <div className="flex justify-between items-center mb-6 text-sm">
                  <span className="font-bold text-white">{service.price ? `${service.price} TND` : 'Sur devis'}</span>
                  <span className="text-gray-500">{service.duration ? `~ ${service.duration}` : ''}</span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(service)}
                    className="flex-1 px-4 py-2 bg-white/5 text-white hover:bg-white/10 rounded-lg transition text-sm font-medium flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-2" /> Modifier
                  </button>
                  <button 
                    onClick={() => setConfirmDelete(service.id)}
                    className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Ajout/Edition */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0B0B0B] border border-white/10 rounded-2xl w-full max-w-2xl p-8 shadow-2xl my-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {isEditing ? "Modifier le service" : "Nouveau service"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Nom de la prestation *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Catégorie *</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3">
                    <option value="Lavage">Lavage</option>
                    <option value="Entretien">Entretien</option>
                    <option value="Esthétique">Esthétique</option>
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Description *</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required rows={3} className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Prix (Optionnel, en TND)</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="ex: 50" className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Durée (Optionnelle)</label>
                  <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="ex: 45 min" className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-400 mb-2">URL de l'image (Optionnelle)</label>
                  <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3" />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition">Annuler</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-[#16A34A] text-[#050505] font-bold rounded-xl hover:bg-[#158f41] transition shadow-[0_0_15px_rgba(22,163,74,0.3)]">
                  {isEditing ? "Enregistrer" : "Créer le service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B0B0B] border border-white/10 rounded-2xl w-full max-w-sm p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <Trash2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Supprimer ce service ?</h2>
            <p className="text-gray-400 mb-8 text-sm">Cette action est irréversible. Les rendez-vous liés pourraient être affectés.</p>
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
