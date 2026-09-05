import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { apiUrl } from "../../lib/api";

export default function Footer() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch(apiUrl('/api/settings'))
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  return (
    <footer className="bg-[#0B0B0B] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <Link to="/" className="flex flex-col items-start font-black tracking-tighter text-2xl leading-none mb-4">
              <span className="text-white">MAGIC</span>
              <span className="text-[#16A34A]">AUTO</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Showroom automobile, lavage, entretien et esthétique — tout ce dont votre voiture a besoin, au même endroit.
            </p>
            <div className="flex space-x-4 pt-2">
              {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition font-bold text-sm">INSTAGRAM</a>}
              {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition font-bold text-sm">FACEBOOK</a>}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Services</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to="/voitures" className="hover:text-white transition">Nos Voitures</Link></li>
              <li><Link to="/lavage" className="hover:text-white transition">Lavage</Link></li>
              <li><Link to="/entretien" className="hover:text-white transition">Entretien</Link></li>
              <li><Link to="/esthetique" className="hover:text-white transition">Esthétique</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Entreprise</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to="/a-propos" className="hover:text-white transition">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link to="/rendez-vous" className="hover:text-white transition">Prendre rendez-vous</Link></li>
              <li><Link to="/admin" className="hover:text-white transition">Espace Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Contact</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
                <span className="bg-black">{settings.address || "123 Avenue de l'Automobile, 75000 Paris"}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-[#16A34A] shrink-0" />
                <span>{settings.phone || "+33 1 23 45 67 89"}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-[#16A34A] shrink-0" />
                <span>{settings.email || "contact@magicauto.com"}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Magic Auto — Tous droits réservés.</p>
          <div className="flex space-x-6">
            <Link to="/mentions-legales" className="hover:text-gray-300 transition">Mentions légales</Link>
            <Link to="/politique-confidentialite" className="hover:text-gray-300 transition">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
