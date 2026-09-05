import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Filter } from "lucide-react";
import { apiUrl } from "../lib/api";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl('/api/vehicles'))
      .then(res => res.json())
      .then(data => {
        setVehicles(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Nos voitures</h1>
            <p className="text-gray-400 max-w-xl">Découvrez notre sélection de véhicules premium disponibles en showroom.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Rechercher (ex: BMW)" 
                className="bg-[#0B0B0B] border border-white/10 text-white rounded-md pl-10 pr-4 py-2 focus:outline-none focus:border-[#16A34A] transition w-full md:w-64"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            </div>
            <button className="bg-[#0B0B0B] border border-white/10 text-white p-2 rounded-md hover:bg-white/5 transition flex items-center justify-center">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-[#0B0B0B] h-96 rounded-lg animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20 bg-[#0B0B0B] rounded-lg border border-white/5">
            <h3 className="text-xl font-bold text-white mb-2">Aucun véhicule disponible pour le moment.</h3>
            <p className="text-gray-400">Revenez plus tard pour voir nos nouveautés.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((v: any) => (
              <Link to={`/voitures/${v.slug}`} key={v.id} className="group bg-[#0B0B0B] rounded-lg overflow-hidden border border-white/5 hover:border-[#16A34A]/50 transition-all duration-300 hover:-translate-y-1 block">
                <div className="relative h-60 overflow-hidden">
                  <img src={v.images.split(',')[0]} alt={v.model} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                    {v.status}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{v.brand}</p>
                      <h3 className="text-xl font-bold text-white">{v.model}</h3>
                    </div>
                    <p className="text-xl font-bold text-[#16A34A]">{v.price.toLocaleString('fr-FR')} TND</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-6">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-gray-600 mr-2"></span>
                      {v.year}
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-gray-600 mr-2"></span>
                      {v.mileage.toLocaleString('fr-FR')} km
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-gray-600 mr-2"></span>
                      {v.fuel}
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-gray-600 mr-2"></span>
                      {v.transmission}
                    </div>
                  </div>
                  <div className="flex items-center text-white font-medium text-sm group-hover:text-[#16A34A] transition">
                    Voir le véhicule <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
