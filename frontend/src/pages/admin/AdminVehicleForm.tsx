import { adminFetch, apiUrl } from "../../lib/api";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Info, Image as ImageIcon, Upload, X, Star, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminVehicleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [loading, setLoading] = useState(isEditing);

  
  const setMainImage = (index: number) => {
      if (index === 0) return;
      const newUrls = [...imageUrls];
      const item = newUrls.splice(index, 1)[0];
      newUrls.unshift(item);
      setFormData({...formData, images: newUrls.join(', ')});
  };

  
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    slug: "",
    price: "",
    year: new Date().getFullYear().toString(),
    mileage: "",
    fuel: "Diesel",
    transmission: "Automatique",
    engine: "",
    power: "",
    color: "",
    bodyType: "SUV",
    description: "",
    equipment: "",
    images: "",
    featured: false,
    status: "Disponible"
  });

const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const imageUrls = formData.images ? formData.images.split(',').map(s => s.trim()).filter(Boolean) : [];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          await uploadFiles(Array.from(e.target.files));
      }
  };

  const handleDrop = async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          await uploadFiles(Array.from(e.dataTransfer.files));
      }
  };

  const uploadFiles = async (files: File[]) => {
      setUploading(true);
      const data = new FormData();
      files.forEach(f => data.append('images', f));

      try {
          const token = localStorage.getItem('admin_token');
          const res = await fetch(apiUrl('/api/admin/upload'), {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`
              },
              body: data
          });
          const result = await res.json();
          if (result.urls) {
              const newUrls = [...imageUrls, ...result.urls];
              setFormData({...formData, images: newUrls.join(', ')});
          } else if (result.error) {
              alert(result.error);
          }
      } catch (err) {
          console.error(err);
          alert("Erreur lors de l'upload des images.");
      } finally {
          setUploading(false);
      }
  };

  const removeImage = (index: number) => {
      const newUrls = [...imageUrls];
      newUrls.splice(index, 1);
      setFormData({...formData, images: newUrls.join(', ')});
  };


  useEffect(() => {
    if (isEditing) {
      adminFetch(`/api/admin/vehicles/${id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            ...data,
            price: data.price.toString(),
            year: data.year.toString(),
            mileage: data.mileage.toString()
          });
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Auto-generate slug from brand and model if slug is empty or currently matches the auto-generation
    if ((name === 'brand' || name === 'model') && !isEditing) {
      const newBrand = name === 'brand' ? value : formData.brand;
      const newModel = name === 'model' ? value : formData.model;
      const autoSlug = `${newBrand} ${newModel}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, [name]: value, slug: autoSlug }));
      return;
    }

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/admin/vehicles/${id}` : "/api/admin/vehicles";
      const method = isEditing ? "PUT" : "POST";
      
      const payload = {
        ...formData,
        price: parseInt(formData.price),
        year: parseInt(formData.year),
        mileage: parseInt(formData.mileage)
      };

      await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      navigate("/admin/voitures");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-white p-8">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center mb-8">
        <Link to="/admin/voitures" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {isEditing ? "Modifier le véhicule" : "Ajouter un véhicule"}
          </h1>
          <p className="text-gray-400 text-sm">Complétez les informations pour la publication en vitrine.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-[#0B0B0B] border border-white/5 p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center"><Info className="w-5 h-5 mr-2 text-[#16A34A]" /> Informations principales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Marque *</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#16A34A] focus:outline-none transition" placeholder="Ex: Mercedes-Benz" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Modèle *</label>
              <input type="text" name="model" value={formData.model} onChange={handleChange} required className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#16A34A] focus:outline-none transition" placeholder="Ex: Classe A 200 AMG Line" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Permalien (Slug) *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full bg-[#050505] border border-white/10 text-gray-500 rounded-xl px-4 py-3 focus:border-[#16A34A] focus:outline-none transition" placeholder="mercedes-classe-a" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Prix (TND) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#16A34A] focus:outline-none transition" placeholder="35000" />
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="bg-[#0B0B0B] border border-white/5 p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Caractéristiques techniques</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Année *</label>
              <input type="number" name="year" value={formData.year} onChange={handleChange} required className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#16A34A] focus:outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Kilométrage *</label>
              <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} required className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#16A34A] focus:outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Carburant *</label>
              <select name="fuel" value={formData.fuel} onChange={handleChange} className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#16A34A] focus:outline-none transition">
                <option value="Diesel">Diesel</option>
                <option value="Essence">Essence</option>
                <option value="Hybride">Hybride</option>
                <option value="Électrique">Électrique</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Boîte de vitesse *</label>
              <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#16A34A] focus:outline-none transition">
                <option value="Automatique">Automatique</option>
                <option value="Manuelle">Manuelle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Carrosserie</label>
              <select name="bodyType" value={formData.bodyType} onChange={handleChange} className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#16A34A] focus:outline-none transition">
                <option value="Citadine">Citadine</option>
                <option value="Berline">Berline</option>
                <option value="Break">Break</option>
                <option value="SUV">SUV</option>
                <option value="Coupé">Coupé</option>
                <option value="Cabriolet">Cabriolet</option>
                <option value="Utilitaire">Utilitaire</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Couleur</label>
              <input type="text" name="color" value={formData.color} onChange={handleChange} className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#16A34A] focus:outline-none transition" placeholder="Ex: Noir Métallisé" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Motorisation</label>
              <input type="text" name="engine" value={formData.engine} onChange={handleChange} className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#16A34A] focus:outline-none transition" placeholder="Ex: 2.0 TDI" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Puissance (ch)</label>
              <input type="text" name="power" value={formData.power} onChange={handleChange} className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#16A34A] focus:outline-none transition" placeholder="Ex: 150" />
            </div>
          </div>
        </div>

        {/* Description & Media */}
        <div className="bg-[#0B0B0B] border border-white/5 p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center"><ImageIcon className="w-5 h-5 mr-2 text-[#16A34A]" /> Présentation & Médias</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Description complète *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={6} className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#16A34A] focus:outline-none transition"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Équipements (séparés par des virgules)</label>
              <textarea name="equipment" value={formData.equipment} onChange={handleChange} rows={3} className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#16A34A] focus:outline-none transition" placeholder="GPS, Sièges chauffants, Toit ouvrant..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Photos du véhicule *</label>
              
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer relative
                  ${isDragging ? 'border-[#16A34A] bg-[#16A34A]/5' : 'border-white/10 bg-[#050505] hover:border-white/30'}`}
              >
                <input 
                  type="file" 
                  multiple 
                  accept="image/jpeg,image/png,image/webp,image/jpg" 
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  title=""
                />
                {uploading ? (
                  <>
                    <Loader2 className="w-12 h-12 text-[#16A34A] animate-spin mb-4" />
                    <p className="text-white font-medium text-lg">Importation en cours...</p>
                  </>
                ) : (
                  <>
                    <Upload className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-[#16A34A]' : 'text-gray-500'}`} />
                    <p className="text-white font-medium text-lg mb-2">
                      {isDragging ? 'Déposez vos photos ici' : 'Ajouter les photos'}
                    </p>
                    <p className="text-gray-400 text-sm mb-6">
                      Glissez vos images ici ou cliquez pour importer un fichier
                    </p>
                    <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition pointer-events-none">
                      Importer des photos
                    </div>
                    <p className="text-gray-500 text-xs mt-4 pointer-events-none">JPG • PNG • WEBP</p>
                  </>
                )}
              </div>

              {imageUrls.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-square bg-[#0B0B0B]">
                      <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-20">
                        {index !== 0 && (
                          <button 
                            type="button"
                            onClick={() => setMainImage(index)}
                            className="px-3 py-1.5 bg-white/10 hover:bg-[#16A34A] text-white text-xs font-bold rounded-lg transition"
                          >
                            Mettre en principal
                          </button>
                        )}
                        <button 
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {index === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-[#16A34A] text-[#050505] text-[10px] font-bold uppercase rounded-md flex items-center shadow-lg z-10">
                          <Star className="w-3 h-3 mr-1" /> Principale
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status & Options */}
        <div className="bg-[#0B0B0B] border border-white/5 p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Publication</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Statut de vente</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#16A34A] focus:outline-none transition">
                <option value="Disponible">Disponible</option>
                <option value="Réservée">Réservée</option>
                <option value="Vendue">Vendue</option>
              </select>
            </div>
            
            <div className="flex items-center h-full pt-6">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="sr-only" />
                  <div className={`block w-14 h-8 rounded-full transition ${formData.featured ? 'bg-[#16A34A]' : 'bg-gray-600'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${formData.featured ? 'translate-x-6' : ''}`}></div>
                </div>
                <div className="ml-3 font-bold text-white">
                  Mettre à la une (Accueil)
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Sticky Submit */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-[#050505]/80 backdrop-blur-md border-t border-white/5 flex justify-end z-40">
           <button type="submit" className="px-8 py-3 bg-[#16A34A] text-[#050505] font-bold rounded-xl hover:bg-[#158f41] transition flex items-center shadow-[0_0_15px_rgba(22,163,74,0.3)]">
             <Save className="w-5 h-5 mr-2" />
             {isEditing ? "Enregistrer les modifications" : "Publier le véhicule"}
           </button>
        </div>
      </form>
    </div>
  );
}
