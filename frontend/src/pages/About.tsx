import { CheckCircle } from "lucide-react";

export default function About() {
  return (
    <div className="w-full">
      <div className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1562347318-6202479e0004?auto=format&fit=crop&q=80" alt="Showroom Magic Auto" className="w-full h-full object-cover object-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">À propos de Magic Auto</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">L'excellence automobile à votre service.</p>
        </div>
      </div>

      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Notre philosophie</h2>
            <p className="text-gray-400 mb-6 leading-relaxed text-lg">
              Chez Magic Auto, nous croyons que chaque véhicule mérite une attention particulière. Notre passion pour l'automobile nous pousse à offrir des services de la plus haute qualité, qu'il s'agisse de la vente de véhicules premium, de l'entretien mécanique ou du detailing esthétique.
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed text-lg">
              Notre équipe d'experts est dédiée à votre satisfaction et utilise les meilleurs équipements et produits pour garantir des résultats exceptionnels.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="text-[#16A34A] w-6 h-6 mr-4" />
                <span className="text-white font-medium">Expertise et savoir-faire</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-[#16A34A] w-6 h-6 mr-4" />
                <span className="text-white font-medium">Produits haut de gamme</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-[#16A34A] w-6 h-6 mr-4" />
                <span className="text-white font-medium">Service client irréprochable</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80" alt="Detailing" className="rounded-lg w-full h-48 object-cover border border-white/5" />
              <img src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80" alt="Entretien" className="rounded-lg w-full h-64 object-cover border border-white/5" />
            </div>
            <div className="space-y-4 mt-8">
              <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80" alt="Showroom" className="rounded-lg w-full h-64 object-cover border border-white/5" />
              <img src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80" alt="Lavage" className="rounded-lg w-full h-48 object-cover border border-white/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
