import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, Calendar, Settings, Info, MessageCircle } from "lucide-react";
import { apiUrl } from "../lib/api";

export default function VehicleDetail() {
  const { slug } = useParams();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl(`/api/vehicles/${slug}`))
      .then(res => res.json())
      .then(data => {
        setVehicle(data);
        setLoading(false);
      })
      .catch(console.error);
  }, [slug]);

  if (loading) {
    return <div className="py-20 text-center text-white">Chargement...</div>;
  }

  if (!vehicle || vehicle.error) {
    return (
      <div className="py-20 text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Véhicule introuvable</h1>
        <Link to="/voitures" className="text-[#16A34A] hover:underline">Retour à la liste</Link>
      </div>
    );
  }

  const images = vehicle.images.split(',');

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/voitures" className="inline-flex items-center text-gray-400 hover:text-white transition mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* GALLERY */}
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden h-[500px] border border-white/5">
              <img src={images[0]} alt={vehicle.model} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.slice(1).map((img: string, i: number) => (
                  <div key={i} className="rounded-lg overflow-hidden h-24 border border-white/5 opacity-70 hover:opacity-100 transition cursor-pointer">
                    <img src={img} alt={`Thumbnail ${i+1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* INFO */}
          <div>
            <div className="mb-6 flex justify-between items-start">
              <div>
                <p className="text-gray-400 font-medium mb-1">{vehicle.brand}</p>
                <h1 className="text-4xl font-bold text-white mb-2">{vehicle.model}</h1>
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white border border-white/10 mt-2">
                  {vehicle.status}
                </div>
              </div>
              <p className="text-3xl font-bold text-[#16A34A]">{vehicle.price.toLocaleString('fr-FR')} TND</p>
            </div>
            
            <p className="text-gray-300 mb-8 leading-relaxed">
              {vehicle.description}
            </p>
            
            <div className="bg-[#0B0B0B] border border-white/5 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Caractéristiques principales</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-5 h-5 mr-3 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Année</p>
                    <p className="font-medium">{vehicle.year}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-300">
                  <Settings className="w-5 h-5 mr-3 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Kilométrage</p>
                    <p className="font-medium">{vehicle.mileage.toLocaleString('fr-FR')} km</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-300">
                  <Info className="w-5 h-5 mr-3 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Carburant</p>
                    <p className="font-medium">{vehicle.fuel}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-300">
                  <Settings className="w-5 h-5 mr-3 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Boîte de vitesses</p>
                    <p className="font-medium">{vehicle.transmission}</p>
                  </div>
                </div>
                {vehicle.color && (
                  <div className="flex items-center text-gray-300">
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vehicle.color === 'Noir' ? '#000' : vehicle.color === 'Blanc' ? '#fff' : vehicle.color.toLowerCase() }}></div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Couleur</p>
                      <p className="font-medium">{vehicle.color}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col space-y-4">
              <Link to={`/rendez-vous?vehicle=${vehicle.id}`} className="w-full flex justify-center items-center px-8 py-4 bg-[#16A34A] text-[#050505] font-bold rounded-md hover:bg-[#158f41] transition">
                Prendre rendez-vous
              </Link>
              <a href="#" className="w-full flex justify-center items-center px-8 py-4 bg-[#0B0B0B] border border-white/20 text-white font-bold rounded-md hover:bg-white/5 transition">
                <MessageCircle className="w-5 h-5 mr-2" /> Demander des informations
              </a>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
