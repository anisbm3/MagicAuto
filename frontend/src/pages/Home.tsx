import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Wrench, Droplets, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { apiUrl } from "../lib/api";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  
  useEffect(() => {
    fetch(apiUrl('/api/vehicles'))
      .then(res => res.json())
      .then(data => setVehicles(data.slice(0, 3)))
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col w-full">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80" 
            alt="Luxury Car" 
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[#16A34A] font-bold tracking-widest text-sm uppercase mb-4 block">Magic Auto</span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Votre voiture mérite <br/>
              <span className="text-white">le meilleur.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg leading-relaxed">
              Showroom automobile, lavage, entretien et esthétique — tout ce dont votre voiture a besoin, au même endroit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/voitures" className="inline-flex justify-center items-center px-8 py-4 bg-white text-[#050505] font-bold rounded-md hover:bg-gray-200 transition">
                Découvrir nos voitures
              </Link>
              <Link to="/rendez-vous" className="inline-flex justify-center items-center px-8 py-4 bg-[#16A34A] text-[#050505] font-bold rounded-md hover:bg-[#158f41] transition">
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-[#0B0B0B] border-y border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col space-y-3">
              <ShieldCheck className="text-[#16A34A] w-8 h-8" />
              <h3 className="text-white font-bold text-lg">Vente automobile</h3>
              <p className="text-gray-400 text-sm">Des véhicules sélectionnés avec soin et révisés.</p>
            </div>
            <div className="flex flex-col space-y-3">
              <Wrench className="text-[#16A34A] w-8 h-8" />
              <h3 className="text-white font-bold text-lg">Entretien</h3>
              <p className="text-gray-400 text-sm">Prenez soin de votre voiture avec nos experts.</p>
            </div>
            <div className="flex flex-col space-y-3">
              <Droplets className="text-[#16A34A] w-8 h-8" />
              <h3 className="text-white font-bold text-lg">Lavage</h3>
              <p className="text-gray-400 text-sm">Un nettoyage complet intérieur et extérieur.</p>
            </div>
            <div className="flex flex-col space-y-3">
              <Sparkles className="text-[#16A34A] w-8 h-8" />
              <h3 className="text-white font-bold text-lg">Esthétique</h3>
              <p className="text-gray-400 text-sm">Redonnez à votre voiture son éclat d'origine.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VEHICLES PREVIEW */}
      <section className="py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Nos voitures</h2>
              <p className="text-gray-400">Découvrez notre sélection de véhicules disponibles.</p>
            </div>
            <Link to="/voitures" className="hidden md:flex items-center text-white hover:text-[#16A34A] transition font-medium">
              Voir toutes les voitures <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          
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

          <div className="mt-10 md:hidden">
            <Link to="/voitures" className="w-full flex justify-center items-center px-6 py-3 border border-white/20 text-white rounded-md hover:bg-white/5 transition">
              Voir toutes les voitures
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-[#0B0B0B] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Nos services</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Des prestations haut de gamme pour l'entretien et l'esthétique de votre véhicule.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/lavage" className="group block p-8 bg-[#050505] rounded-lg border border-white/5 hover:border-[#16A34A]/50 transition">
              <Droplets className="w-10 h-10 text-[#16A34A] mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Lavage</h3>
              <p className="text-gray-400 text-sm mb-6">Nettoyage intérieur et extérieur professionnel.</p>
              <span className="text-sm font-medium text-white flex items-center group-hover:text-[#16A34A] transition">
                Découvrir <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            </Link>
            
            <Link to="/entretien" className="group block p-8 bg-[#050505] rounded-lg border border-white/5 hover:border-[#16A34A]/50 transition">
              <Wrench className="w-10 h-10 text-[#16A34A] mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Entretien</h3>
              <p className="text-gray-400 text-sm mb-6">Vidange, filtres, freins et diagnostic complet.</p>
              <span className="text-sm font-medium text-white flex items-center group-hover:text-[#16A34A] transition">
                Découvrir <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            </Link>

            <Link to="/esthetique" className="group block p-8 bg-[#050505] rounded-lg border border-white/5 hover:border-[#16A34A]/50 transition">
              <Sparkles className="w-10 h-10 text-[#16A34A] mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Esthétique</h3>
              <p className="text-gray-400 text-sm mb-6">Detailing, polish, lustrage et rénovation.</p>
              <span className="text-sm font-medium text-white flex items-center group-hover:text-[#16A34A] transition">
                Découvrir <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
