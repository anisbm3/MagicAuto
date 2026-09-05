import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0B0B0B]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex flex-col items-center justify-center font-black tracking-tighter text-xl leading-none">
            <span className="text-white">MAGIC</span>
            <span className="text-[#16A34A]">AUTO</span>
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center text-sm font-medium">
            <Link to="/voitures" className="text-gray-300 hover:text-white transition-colors">Nos voitures</Link>
            <Link to="/lavage" className="text-gray-300 hover:text-white transition-colors">Lavage</Link>
            <Link to="/entretien" className="text-gray-300 hover:text-white transition-colors">Entretien</Link>
            <Link to="/esthetique" className="text-gray-300 hover:text-white transition-colors">Esthétique</Link>
            <Link to="/a-propos" className="text-gray-300 hover:text-white transition-colors">À propos</Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/voitures" className="text-sm font-medium text-white px-4 py-2 border border-white/20 rounded-md hover:bg-white/10 transition">
              Voir les voitures
            </Link>
            <Link to="/rendez-vous" className="text-sm font-bold text-[#050505] bg-[#16A34A] px-5 py-2.5 rounded-md hover:bg-[#158f41] transition">
              Prendre rendez-vous
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#0B0B0B] border-t border-white/10">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            <Link onClick={() => setIsOpen(false)} to="/voitures" className="block py-3 text-lg font-medium border-b border-white/5">Nos voitures</Link>
            <Link onClick={() => setIsOpen(false)} to="/lavage" className="block py-3 text-lg font-medium border-b border-white/5">Lavage</Link>
            <Link onClick={() => setIsOpen(false)} to="/entretien" className="block py-3 text-lg font-medium border-b border-white/5">Entretien</Link>
            <Link onClick={() => setIsOpen(false)} to="/esthetique" className="block py-3 text-lg font-medium border-b border-white/5">Esthétique</Link>
            <Link onClick={() => setIsOpen(false)} to="/a-propos" className="block py-3 text-lg font-medium border-b border-white/5">À propos</Link>
            <Link onClick={() => setIsOpen(false)} to="/contact" className="block py-3 text-lg font-medium border-b border-white/5">Contact</Link>
            
            <div className="pt-4 flex flex-col space-y-3">
              <Link onClick={() => setIsOpen(false)} to="/rendez-vous" className="text-center font-bold text-[#050505] bg-[#16A34A] px-5 py-3 rounded-md">
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
