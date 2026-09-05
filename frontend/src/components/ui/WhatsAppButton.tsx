import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "+33612345678"; // Dummy phone number, the user can change it via settings if needed, but for now hardcode.
  const message = encodeURIComponent("Bonjour Magic Auto, j'aimerais avoir plus d'informations.");
  
  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-transform duration-300 flex items-center justify-center group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Besoin d'aide ?
      </span>
    </a>
  );
}
