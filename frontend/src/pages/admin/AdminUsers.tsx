import { adminFetch } from "../../lib/api";
import React, { useState, useEffect } from "react";
import { Plus, Search, MoreVertical, Shield, UserX, UserCheck, Trash2, Key } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "ADMIN",
    active: true
  });

  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminFetch("/api/admin/users");
      if (!res.ok) throw new Error("Accès refusé ou erreur serveur");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les utilisateurs. Êtes-vous Super Admin ?");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!isEditing && !formData.password) {
       setError("Le mot de passe est requis pour un nouvel utilisateur.");
       return;
    }

    try {
      const url = isEditing ? `/api/admin/users/${currentId}` : "/api/admin/users";
      const method = isEditing ? "PUT" : "POST";

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
         const data = await res.json();
         throw new Error(data.error || "Erreur");
      }
      
      setShowModal(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await adminFetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
         const data = await res.json();
         throw new Error(data.error || "Erreur de suppression");
      }
      setConfirmDelete(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
      setConfirmDelete(null);
    }
  };

  const toggleStatus = async (user: any) => {
    try {
      const res = await adminFetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, active: !user.active })
      });
      if (!res.ok) {
         const data = await res.json();
         throw new Error(data.error || "Erreur");
      }
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openNewModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ username: "", password: "", role: "ADMIN", active: true });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (user: any) => {
    setIsEditing(true);
    setCurrentId(user.id);
    setFormData({ username: user.username, password: "", role: user.role, active: user.active });
    setError("");
    setShowModal(true);
  };

  if (loading) return <div className="text-white p-8">Chargement...</div>;
  if (error && users.length === 0) return <div className="text-red-500 p-8 bg-red-500/10 rounded-xl m-8 border border-red-500/20">{error}</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Utilisateurs</h1>
          <p className="text-gray-400">Gérez les accès administrateurs au tableau de bord.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="px-6 py-3 bg-[#16A34A] text-[#050505] font-bold rounded-xl hover:bg-[#158f41] transition flex items-center shadow-[0_0_15px_rgba(22,163,74,0.3)]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un utilisateur
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-[#0B0B0B] border border-white/5 p-4 rounded-2xl mb-8 flex items-center">
        <Search className="w-5 h-5 text-gray-500 mr-3" />
        <input 
          type="text"
          placeholder="Rechercher par nom ou rôle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none text-white focus:outline-none w-full placeholder:text-gray-600"
        />
      </div>

      {/* TABLE */}
      <div className="bg-[#0B0B0B] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rôle</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date de création</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition group">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mr-3 text-white font-bold border border-white/10">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-white">{user.username}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                        user.role === 'SUPER_ADMIN' 
                          ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' 
                          : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}>
                        {user.role === 'SUPER_ADMIN' ? <Shield className="w-3 h-3 mr-1" /> : null}
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => toggleStatus(user)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border transition ${
                          user.active 
                            ? 'bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20 hover:bg-[#16A34A]/20' 
                            : 'bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20'
                        }`}
                      >
                        {user.active ? 'Actif' : 'Inactif'}
                      </button>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(user)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition" title="Modifier">
                          <Key className="w-4 h-4" />
                        </button>
                        <button onClick={() => setConfirmDelete(user.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL AJOUT/EDITION */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B0B0B] border border-white/10 rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {isEditing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
            </h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Nom d'utilisateur</label>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  required
                  className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#16A34A] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">
                  {isEditing ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
                </label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required={!isEditing}
                  className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#16A34A] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Rôle</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#16A34A] transition"
                >
                  <option value="ADMIN">Administrateur (ADMIN)</option>
                  <option value="SUPER_ADMIN">Super Administrateur (SUPER_ADMIN)</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#16A34A] text-[#050505] font-bold rounded-xl hover:bg-[#158f41] transition shadow-[0_0_15px_rgba(22,163,74,0.3)]"
                >
                  {isEditing ? "Enregistrer" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMATION SUPPRESSION */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B0B0B] border border-white/10 rounded-2xl w-full max-w-sm p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <Trash2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Supprimer cet administrateur ?</h2>
            <p className="text-gray-400 mb-8 text-sm">Cette action est irréversible. L'utilisateur n'aura plus accès au tableau de bord.</p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition"
              >
                Annuler
              </button>
              <button 
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
