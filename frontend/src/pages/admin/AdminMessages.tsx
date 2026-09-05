import { adminFetch } from "../../lib/api";
import { useState, useEffect } from "react";
import { Mail, CheckCircle, Trash2, Search } from "lucide-react";

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await adminFetch("/api/admin/messages");
      const data = await res.json();
      setMessages(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase())
  );

  const markAsRead = async (id: number) => {
    try {
      await adminFetch(`/api/admin/messages/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 'Read' })
      });
      fetchMessages();
      if (selectedMessage && selectedMessage.id === id) {
         setSelectedMessage({ ...selectedMessage, status: 'Read' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminFetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      setConfirmDelete(null);
      if (selectedMessage && selectedMessage.id === id) setSelectedMessage(null);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-white p-8">Chargement...</div>;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-white mb-2">Boîte de réception</h1>
        <p className="text-gray-400">Gérez les demandes de contact de vos clients.</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* LIST */}
        <div className="w-full lg:w-1/3 flex flex-col bg-[#0B0B0B] border border-white/5 rounded-2xl overflow-hidden shrink-0">
          <div className="p-4 border-b border-white/5 bg-[#111]">
            <div className="bg-[#050505] border border-white/10 p-2 rounded-xl flex items-center">
              <Search className="w-4 h-4 text-gray-500 mx-2 shrink-0" />
              <input 
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder:text-gray-600"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
             {filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                   Aucun message.
                </div>
             ) : (
                filteredMessages.map(msg => (
                  <div 
                    key={msg.id}
                    onClick={() => {
                       setSelectedMessage(msg);
                       if (msg.status === 'Unread') markAsRead(msg.id);
                    }}
                    className={`p-4 border-b border-white/5 cursor-pointer transition-colors ${selectedMessage?.id === msg.id ? 'bg-white/5' : 'hover:bg-white/5'} ${msg.status === 'Unread' ? 'border-l-4 border-l-[#16A34A]' : 'border-l-4 border-l-transparent'}`}
                  >
                     <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm ${msg.status === 'Unread' ? 'font-bold text-white' : 'font-medium text-gray-300'}`}>{msg.name}</span>
                        <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                           {new Date(msg.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                        </span>
                     </div>
                     <h4 className={`text-xs mb-1 truncate ${msg.status === 'Unread' ? 'font-bold text-gray-200' : 'text-gray-400'}`}>{msg.subject}</h4>
                     <p className="text-xs text-gray-500 truncate">{msg.message}</p>
                  </div>
                ))
             )}
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex-1 bg-[#0B0B0B] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
          {selectedMessage ? (
             <>
               <div className="p-6 border-b border-white/5 bg-[#111] flex justify-between items-start">
                  <div>
                     <h2 className="text-xl font-bold text-white mb-4">{selectedMessage.subject}</h2>
                     <div className="flex items-center gap-4 text-sm">
                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                           {selectedMessage.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                           <p className="font-bold text-white">{selectedMessage.name}</p>
                           <div className="flex gap-4 text-gray-400 text-xs mt-1">
                              <span>{selectedMessage.email}</span>
                              <span>•</span>
                              <span>{selectedMessage.phone}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => setConfirmDelete(selectedMessage.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition" title="Supprimer">
                        <Trash2 className="w-5 h-5" />
                     </button>
                  </div>
               </div>
               
               <div className="flex-1 p-6 overflow-y-auto">
                  <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                     {selectedMessage.message}
                  </div>
               </div>
               
               <div className="p-6 border-t border-white/5 bg-[#111] text-xs text-gray-500">
                  Reçu le {new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}
               </div>
             </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                <Mail className="w-16 h-16 mb-4 opacity-20" />
                <p>Sélectionnez un message pour le lire.</p>
             </div>
          )}
        </div>

      </div>

      {/* Modal Suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B0B0B] border border-white/10 rounded-2xl w-full max-w-sm p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <Trash2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Supprimer ce message ?</h2>
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
