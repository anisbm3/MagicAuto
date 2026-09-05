import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import BeforeAfterSlider from "../components/ui/BeforeAfterSlider";
import { apiUrl } from "../lib/api";

export default function Esthetique() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch(apiUrl('/api/services'))
      .then(res => res.json())
      .then(data => setServices(data.filter((s: any) => s.category === 'Esthétique')))
      .catch(console.error);
  }, []);

  return (
    <div className="w-full bg-[#050505]">
      {/* Premium Hero Section */}
      <div className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80" alt="Esthétique Auto" className="w-full h-full object-cover object-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-[#16A34A] font-bold tracking-widest text-sm uppercase mb-4 block">MAGIC AUTO ESTHÉTIQUE</span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Redonnez à votre voiture <br/>
              <span className="text-white">son éclat d'origine.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Detailing, polissage, lustrage et protection céramique. Un savoir-faire luxueux pour magnifier chaque courbe de votre véhicule.
            </p>
            {services.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={`/rendez-vous?service=${services[0]?.id}`} className="px-8 py-4 bg-[#16A34A] text-[#050505] font-bold rounded-md hover:bg-[#158f41] transition flex items-center justify-center text-lg">
                  Réserver une prestation <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">L'art de la perfection</h2>
            <p className="text-gray-400 text-lg">Découvrez la différence d'un traitement esthétique professionnel. Glissez le curseur pour voir le résultat.</p>
          </div>
          
          <BeforeAfterSlider 
            beforeImage="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80" 
            afterImage="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80"
          />
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Nos Prestations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s: any) => (
            <div key={s.id} className="group bg-[#0B0B0B] border border-white/5 rounded-2xl overflow-hidden flex flex-col hover:border-[#16A34A]/50 transition-all duration-300 hover:-translate-y-2 shadow-lg">
              <div className="h-48 overflow-hidden relative bg-[#111]">
                 {s.image ? (
                   <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                     <Sparkles className="w-20 h-20 text-white/10" />
                   </div>
                 )}
                 <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                   <span className="text-xs font-bold text-white uppercase tracking-wider">{s.category}</span>
                 </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#16A34A] transition-colors">{s.name}</h3>
                <p className="text-[#16A34A] text-xl font-bold mb-4">{s.price ? `${s.price} TND` : 'Sur devis'} {s.duration && <span className="text-sm text-gray-500 font-normal ml-2">— ~{s.duration} min</span>}</p>
                <p className="text-gray-400 mb-8 line-clamp-3 leading-relaxed flex-1">{s.description}</p>
                
                <Link to={`/rendez-vous?service=${s.id}`} className="flex items-center justify-between w-full mt-auto px-6 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-[#16A34A] hover:text-[#050505] transition-all duration-300 group">
                  <span>Réserver {s.name.toLowerCase()}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
