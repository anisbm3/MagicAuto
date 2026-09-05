import { adminFetch } from "../../lib/api";
import React, { useState, useEffect } from "react";
import { Save, Info } from "lucide-react";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    openingHours: "",
    seoTitle: "",
    seoDescription: ""
  });

  useEffect(() => {
    adminFetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setFormData(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    
    try {
      await adminFetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-8">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Paramètres de l'entreprise</h1>
        <p className="text-gray-400">Configurez les informations publiques affichées sur votre site.</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-[#16A34A]/10 border border-[#16A34A]/20 text-[#16A34A] rounded-xl font-bold flex items-center">
          <Info className="w-5 h-5 mr-3 shrink-0" /> Paramètres enregistrés avec succès.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Informations Générales */}
        <div className="bg-[#0B0B0B] border border-white/5 p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Informations de contact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Nom de l'entreprise</label>
              <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#16A34A]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Email de contact</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#16A34A]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Téléphone principal</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#16A34A]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Numéro WhatsApp (ex: +33612345678)</label>
              <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} required className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#16A34A]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-400 mb-2">Adresse physique</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#16A34A]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-400 mb-2">Horaires d'ouverture (Texte libre)</label>
              <input type="text" name="openingHours" value={formData.openingHours} onChange={handleChange} required className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#16A34A]" placeholder="Lun-Sam: 9h-18h" />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-[#0B0B0B] border border-white/5 p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Référencement (SEO)</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Titre du site (Title)</label>
              <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} required className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#16A34A]" />
              <p className="text-xs text-gray-500 mt-2">Ce texte apparaît dans l'onglet du navigateur et les résultats Google.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Description du site (Meta Description)</label>
              <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} required rows={3} className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#16A34A]"></textarea>
              <p className="text-xs text-gray-500 mt-2">Résumé de votre activité pour les moteurs de recherche.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
           <button 
             type="submit" 
             disabled={saving}
             className="px-8 py-4 bg-[#16A34A] text-[#050505] font-bold rounded-xl hover:bg-[#158f41] transition flex items-center shadow-[0_0_15px_rgba(22,163,74,0.3)] disabled:opacity-50"
           >
             {saving ? 'Enregistrement...' : <><Save className="w-5 h-5 mr-2" /> Enregistrer les paramètres</>}
           </button>
        </div>
      </form>
    </div>
  );
}
