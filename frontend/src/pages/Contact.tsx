import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import { apiUrl } from "../lib/api";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().min(8, "Numéro invalide"),
  subject: z.string().min(2, "Sujet requis"),
  message: z.string().min(5, "Message trop court"),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch(apiUrl('/api/settings'))
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Info */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-6">Contactez-nous</h1>
          <p className="text-gray-400 mb-12 max-w-md leading-relaxed">
            Une question sur un véhicule ? Un besoin particulier pour l'entretien de votre voiture ? Notre équipe est à votre disposition.
          </p>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#16A34A]/10 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="text-[#16A34A] w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Notre Showroom</h4>
                <p className="text-gray-400">{settings.address || "123 Avenue de l'Automobile, 75000 Paris"}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#16A34A]/10 rounded-full flex items-center justify-center shrink-0">
                <Phone className="text-[#16A34A] w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Téléphone</h4>
                <p className="text-gray-400">{settings.phone || "+33 1 23 45 67 89"}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#16A34A]/10 rounded-full flex items-center justify-center shrink-0">
                <Mail className="text-[#16A34A] w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Email</h4>
                <p className="text-gray-400">{settings.email || "contact@magicauto.com"}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-12 border-t border-white/10">
            <h4 className="text-white font-bold mb-4">Horaires d'ouverture</h4>
            <div className="text-gray-400 max-w-xs whitespace-pre-line">
              {settings.openingHours || "Lundi - Samedi : 09:00 - 18:00\nDimanche : Fermé"}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#0B0B0B] border border-white/5 p-8 md:p-12 rounded-xl">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <MessageSquare className="w-16 h-16 text-[#16A34A] mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">Message envoyé</h3>
              <p className="text-gray-400 mb-8">Nous vous répondrons dans les plus brefs délais.</p>
              <button onClick={() => setSubmitted(false)} className="px-6 py-3 border border-white/20 text-white rounded-md hover:bg-white/5 transition">
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-8">Envoyez-nous un message</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Nom</label>
                  <input type="text" {...register("name")} className="w-full bg-[#050505] border border-white/10 text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#16A34A] transition" />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input type="email" {...register("email")} className="w-full bg-[#050505] border border-white/10 text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#16A34A] transition" />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Téléphone</label>
                  <input type="tel" {...register("phone")} className="w-full bg-[#050505] border border-white/10 text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#16A34A] transition" />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Sujet</label>
                  <input type="text" {...register("subject")} className="w-full bg-[#050505] border border-white/10 text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#16A34A] transition" />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea rows={5} {...register("message")} className="w-full bg-[#050505] border border-white/10 text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#16A34A] transition"></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>
              
              <button type="submit" disabled={isSubmitting} className="w-full px-6 py-4 bg-[#16A34A] text-[#050505] font-bold rounded-md hover:bg-[#158f41] transition disabled:opacity-50">
                {isSubmitting ? 'Envoi...' : 'Envoyer le message'}
              </button>
            </form>
          )}
        </div>
        
      </div>
    </div>
  );
}
