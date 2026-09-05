import { adminFetch } from "../../lib/api";
import { useState, useEffect } from "react";
import { Star, Search, Trash2, CheckCircle, XCircle } from "lucide-react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await adminFetch("/api/admin/reviews");
      const data = await res.json();
      setReviews(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.customerName.toLowerCase().includes(search.toLowerCase()) || 
    r.comment.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = async (review: any) => {
    try {
      await adminFetch(`/api/admin/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...review, active: !review.active })
      });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminFetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      setConfirmDelete(null);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`} />
    ));
  };

  if (loading) return <div className="text-white p-8">Chargement...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Avis Clients</h1>
        <p className="text-gray-400">Gérez les avis affichés sur votre site web.</p>
      </div>

      <div className="bg-[#0B0B0B] border border-white/5 p-4 rounded-2xl mb-8 flex items-center">
        <Search className="w-5 h-5 text-gray-500 mr-3" />
        <input 
          type="text"
          placeholder="Rechercher par nom ou contenu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none text-white focus:outline-none w-full placeholder:text-gray-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredReviews.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-[#0B0B0B] border border-white/5 rounded-2xl">
               <Star className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
               <p className="text-gray-500">Aucun avis trouvé.</p>
            </div>
         ) : (
            filteredReviews.map(review => (
               <div key={review.id} className={`bg-[#0B0B0B] border border-white/5 rounded-2xl p-6 transition-opacity ${!review.active ? 'opacity-60' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex gap-1">
                        {renderStars(review.rating)}
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => toggleStatus(review)} title={review.active ? "Masquer du site" : "Afficher sur le site"}>
                           {review.active ? (
                              <CheckCircle className="w-5 h-5 text-[#16A34A]" />
                           ) : (
                              <XCircle className="w-5 h-5 text-gray-500" />
                           )}
                        </button>
                        <button onClick={() => setConfirmDelete(review.id)} title="Supprimer" className="text-red-500 hover:text-red-400 transition">
                           <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
                  
                  <p className="text-white text-sm leading-relaxed mb-4 italic">"{review.comment}"</p>
                  
                  <div className="flex justify-between items-end border-t border-white/5 pt-4">
                     <p className="font-bold text-gray-300 text-sm">{review.customerName}</p>
                     <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('fr-FR')}</p>
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
            <h2 className="text-xl font-bold text-white mb-2">Supprimer cet avis ?</h2>
            <p className="text-gray-400 mb-8 text-sm">Cette action est irréversible.</p>
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
