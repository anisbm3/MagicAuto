import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, Clock, CheckCircle, ChevronRight, User, Phone, Car } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { apiUrl } from "../lib/api";

const schema = z.object({
  customerName: z.string().min(2, "Nom et Prénom requis"),
  customerPhone: z.string().min(8, "Numéro invalide"),
  serviceId: z.string().min(1, "Veuillez sélectionner un service").refine(val => val !== "0", "Veuillez sélectionner un service"),
  vehicleBrand: z.string().min(2, "Marque de véhicule requise"),
  date: z.string().min(1, "Date requise"),
  time: z.string().min(1, "Heure requise"),
});

type FormData = z.infer<typeof schema>;

export default function Booking() {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState("");
  const [serverError, setServerError] = useState("");
  const [availability, setAvailability] = useState<Record<string, number>>({});
  
  const initialServiceId = searchParams.get('service') || "0";
  const hasInitialService = initialServiceId !== "0";
  const [step, setStep] = useState(hasInitialService ? 2 : 1);

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceId: initialServiceId,
    }
  });

  const selectedDate = watch("date");
  const selectedTime = watch("time");
  const selectedServiceId = watch("serviceId");
  const selectedService = services.find(s => s.id.toString() === selectedServiceId);

  const TIME_SLOTS = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  useEffect(() => {
    fetch(apiUrl('/api/services'))
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetch(apiUrl(`/api/appointments/availability?date=${selectedDate}`))
        .then(res => res.json())
        .then(data => setAvailability(data))
        .catch(console.error);
    }
  }, [selectedDate]);

  const nextStep = async (targetStep: number) => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger("serviceId");
    } else if (step === 2) {
      isValid = await trigger(["date", "time"]);
    } else if (step === 3) {
      isValid = await trigger(["customerName", "customerPhone", "vehicleBrand"]);
    }
    
    if (isValid) {
      setStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      const response = await fetch(apiUrl('/api/appointments'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, serviceId: parseInt(data.serviceId) }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setRefId(result.reference);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setServerError(result.error || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error(error);
      setServerError("Erreur de connexion au serveur.");
    }
  };

  if (submitted) {
    return (
      <div className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="bg-[#0B0B0B] border border-white/5 p-12 rounded-xl text-center w-full shadow-2xl">
          <div className="w-24 h-24 bg-[#16A34A]/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-[#16A34A]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Rendez-vous enregistré !</h1>
          <p className="text-gray-400 mb-8 text-lg">
            Votre demande de rendez-vous a bien été enregistrée.
          </p>
          
          <div className="bg-[#111] p-8 rounded-xl mb-10 max-w-md mx-auto text-left border border-white/5">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Référence</p>
            <p className="text-2xl font-bold text-[#16A34A] mb-6">{refId}</p>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-gray-400">Prestation</span>
                <span className="text-white font-bold">{selectedService?.name || "Service"}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-gray-400">Date et heure</span>
                <span className="text-white font-bold">{watch('date')} à {watch('time')}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-gray-400">Client</span>
                <span className="text-white font-bold">{watch('customerName')}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-gray-400">Téléphone</span>
                <span className="text-white font-bold">{watch('customerPhone')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Voiture</span>
                <span className="text-white font-bold">{watch('vehicleBrand')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="px-8 py-4 bg-[#16A34A] text-[#050505] font-bold rounded-md hover:bg-[#158f41] transition">
              Retour à l'accueil
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-md hover:bg-white/10 transition">
              Contacter Magic Auto
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, title: "Prestation" },
    { num: 2, title: "Date & Heure" },
    { num: 3, title: "Informations" },
    { num: 4, title: "Confirmation" }
  ];

  return (
    <div className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Prendre rendez-vous</h1>
        <p className="text-gray-400 text-lg">Réservez votre créneau en quelques secondes.</p>
      </div>
      
      {/* Progress Indicator */}
      <div className="mb-12 max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 z-0"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#16A34A] z-0 transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          
          {steps.map(s => (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-3 transition-colors ${step >= s.num ? 'bg-[#16A34A] text-[#050505]' : 'bg-[#1A1A1A] text-gray-500 border border-white/10'}`}>
                {step > s.num ? <CheckCircle className="w-6 h-6" /> : s.num}
              </div>
              <span className={`text-xs uppercase tracking-wider font-bold hidden sm:block ${step >= s.num ? 'text-white' : 'text-gray-500'}`}>{s.title}</span>
            </div>
          ))}
        </div>
        <div className="text-center sm:hidden mt-6">
          <span className="text-[#16A34A] font-bold text-sm uppercase tracking-wider">Étape {step} sur 4 : {steps[step-1].title}</span>
        </div>
      </div>

      <div className="bg-[#0B0B0B] border border-white/5 p-6 md:p-12 rounded-xl shadow-2xl">
        {selectedService && step > 1 && (
           <div className="mb-10 p-5 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Votre prestation</p>
                <p className="text-white font-bold text-lg flex items-center"><CheckCircle className="w-5 h-5 text-[#16A34A] mr-3" /> {selectedService.name}</p>
              </div>
              {!hasInitialService && step > 1 && (
                 <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-[#16A34A] hover:text-[#158f41] transition">Modifier</button>
              )}
           </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* STEP 1: SERVICE */}
          <div className={step === 1 ? 'block' : 'hidden'}>
            <h3 className="text-2xl font-bold text-white mb-8">Que souhaitez-vous réserver ?</h3>
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((s: any) => (
                  <label key={s.id} className={`cursor-pointer p-5 rounded-xl border flex items-center transition-all ${selectedServiceId === s.id.toString() ? 'bg-[#16A34A]/10 border-[#16A34A]' : 'bg-[#050505] border-white/10 hover:border-white/30'}`}>
                    <input type="radio" value={s.id} {...register("serviceId")} className="hidden" />
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 ${selectedServiceId === s.id.toString() ? 'border-[#16A34A]' : 'border-gray-500'}`}>
                      {selectedServiceId === s.id.toString() && <div className="w-3 h-3 bg-[#16A34A] rounded-full"></div>}
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">{s.name}</p>
                      <p className="text-sm text-gray-400 mt-1">{s.category}</p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.serviceId && <p className="text-red-500 text-sm mt-4 font-medium">{errors.serviceId.message}</p>}
            </div>
            <div className="mt-10 flex justify-end">
               <button type="button" onClick={() => nextStep(2)} className="px-8 py-4 bg-[#16A34A] text-[#050505] font-bold rounded-md hover:bg-[#158f41] transition flex items-center text-lg">
                 Continuer <ChevronRight className="w-6 h-6 ml-2" />
               </button>
            </div>
          </div>

          {/* STEP 2: DATE & TIME */}
          <div className={step === 2 ? 'block' : 'hidden'}>
            <h3 className="text-2xl font-bold text-white mb-8">Choisissez votre date et heure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Date souhaitée</label>
                <div className="relative">
                  <input 
                    type="date" 
                    {...register("date")}
                    className="w-full bg-[#050505] border border-white/10 text-white rounded-md px-5 py-4 focus:outline-none focus:border-[#16A34A] transition [color-scheme:dark] text-lg"
                  />
                </div>
                {errors.date && <p className="text-red-500 text-sm mt-2 font-medium">{errors.date.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Heure d'arrivée</label>
                {selectedDate ? (
                  <div className="grid grid-cols-3 gap-3">
                    {TIME_SLOTS.map((slot) => {
                      const count = availability[slot] || 0;
                      const isFull = count >= 3;
                      const remaining = 3 - count;
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isFull}
                          onClick={() => setValue("time", slot, { shouldValidate: true })}
                          className={`p-3 rounded-md border text-center flex flex-col items-center transition-all ${
                            isFull 
                              ? 'bg-red-500/5 border-red-500/10 text-red-500/30 cursor-not-allowed' 
                              : isSelected
                              ? 'bg-[#16A34A] border-[#16A34A] text-[#050505] shadow-[0_0_15px_rgba(22,163,74,0.4)]'
                              : 'bg-[#050505] border-white/10 text-white hover:border-[#16A34A]/50 hover:bg-white/5'
                          }`}
                        >
                          <span className="font-bold text-lg mb-1">{slot}</span>
                          <span className={`text-[10px] uppercase tracking-wider ${isFull ? '' : isSelected ? 'text-[#050505]/80 font-bold' : 'text-gray-400'}`}>
                            {isFull ? 'Complet' : remaining === 3 ? 'Dispo' : `${remaining} place${remaining > 1 ? 's' : ''}`}
                          </span>
                        </button>
                      );
                    })}
                    <input type="hidden" {...register("time")} />
                  </div>
                ) : (
                  <div className="p-8 bg-[#050505] border border-white/5 rounded-md text-gray-500 text-sm text-center h-[calc(100%-32px)] flex flex-col items-center justify-center">
                    <Calendar className="w-10 h-10 mb-4 opacity-20" />
                    <p className="text-base">Veuillez d'abord sélectionner une date</p>
                  </div>
                )}
                {errors.time && <p className="text-red-500 text-sm mt-3 font-medium">{errors.time.message}</p>}
              </div>
            </div>
            
            <div className="mt-12 flex justify-between pt-8 border-t border-white/10">
               <button type="button" onClick={() => setStep(hasInitialService ? 2 : 1)} className={`px-6 py-4 bg-transparent border border-white/20 text-white font-bold rounded-md hover:bg-white/10 transition ${hasInitialService ? 'invisible' : ''}`}>
                 Retour
               </button>
               <button type="button" onClick={() => nextStep(3)} className="px-8 py-4 bg-[#16A34A] text-[#050505] font-bold rounded-md hover:bg-[#158f41] transition flex items-center text-lg">
                 Continuer <ChevronRight className="w-6 h-6 ml-2" />
               </button>
            </div>
          </div>

          {/* STEP 3: CUSTOMER INFO */}
          <div className={step === 3 ? 'block' : 'hidden'}>
            <h3 className="text-2xl font-bold text-white mb-8">Vos informations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center"><User className="w-4 h-4 mr-2"/> Nom et Prénom</label>
                <input type="text" {...register("customerName")} className="w-full bg-[#050505] border border-white/10 text-white rounded-md px-5 py-4 focus:outline-none focus:border-[#16A34A] transition text-lg" placeholder="Votre nom complet" />
                {errors.customerName && <p className="text-red-500 text-sm mt-2 font-medium">{errors.customerName.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center"><Phone className="w-4 h-4 mr-2"/> Téléphone</label>
                <input type="tel" {...register("customerPhone")} className="w-full bg-[#050505] border border-white/10 text-white rounded-md px-5 py-4 focus:outline-none focus:border-[#16A34A] transition text-lg" placeholder="Ex: 06 12 34 56 78" />
                {errors.customerPhone && <p className="text-red-500 text-sm mt-2 font-medium">{errors.customerPhone.message}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center"><Car className="w-4 h-4 mr-2"/> Marque du véhicule</label>
                <input type="text" {...register("vehicleBrand")} className="w-full bg-[#050505] border border-white/10 text-white rounded-md px-5 py-4 focus:outline-none focus:border-[#16A34A] transition text-lg" placeholder="Ex: BMW, Mercedes, Renault..." />
                {errors.vehicleBrand && <p className="text-red-500 text-sm mt-2 font-medium">{errors.vehicleBrand.message}</p>}
              </div>
            </div>
            
            <div className="mt-12 flex justify-between pt-8 border-t border-white/10">
               <button type="button" onClick={() => setStep(2)} className="px-6 py-4 bg-transparent border border-white/20 text-white font-bold rounded-md hover:bg-white/10 transition">
                 Retour
               </button>
               <button type="button" onClick={() => nextStep(4)} className="px-8 py-4 bg-[#16A34A] text-[#050505] font-bold rounded-md hover:bg-[#158f41] transition flex items-center text-lg">
                 Vérifier ma réservation <ChevronRight className="w-6 h-6 ml-2" />
               </button>
            </div>
          </div>

          {/* STEP 4: CONFIRMATION SUMMARY */}
          <div className={step === 4 ? 'block' : 'hidden'}>
            <h3 className="text-2xl font-bold text-white mb-8">Votre rendez-vous</h3>
            
            <div className="bg-[#111] border border-white/10 rounded-xl p-8 mb-10 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Prestation</p>
                  <p className="text-xl text-white font-bold">{selectedService?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Date et Heure</p>
                  <p className="text-xl text-white font-bold flex items-center">
                    <Calendar className="w-5 h-5 mr-3 text-[#16A34A]" /> {watch('date')} à {watch('time')}
                  </p>
                </div>
                <div className="pt-6 border-t border-white/5">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Client</p>
                  <p className="text-xl text-white font-bold">{watch('customerName')}</p>
                </div>
                <div className="pt-6 border-t border-white/5">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Téléphone</p>
                  <p className="text-xl text-white font-bold">{watch('customerPhone')}</p>
                </div>
                <div className="pt-6 border-t border-white/5 sm:col-span-2">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Voiture</p>
                  <p className="text-xl text-white font-bold">{watch('vehicleBrand')}</p>
                </div>
              </div>
            </div>

            {serverError && (
              <div className="p-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md mb-8 flex items-start">
                <div className="w-6 h-6 mr-3 shrink-0 mt-0.5 rounded-full border border-red-500 flex items-center justify-center font-bold">!</div>
                <p className="text-lg">{serverError}</p>
              </div>
            )}
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
               <button type="button" onClick={() => setStep(3)} className="px-6 py-4 bg-transparent border border-white/20 text-white font-bold rounded-md hover:bg-white/10 transition order-2 sm:order-1 text-center">
                 Modifier les informations
               </button>
               <button 
                 type="submit" 
                 disabled={isSubmitting}
                 className="px-10 py-4 bg-[#16A34A] text-[#050505] font-bold rounded-md hover:bg-[#158f41] transition disabled:opacity-50 text-xl order-1 sm:order-2 w-full sm:w-auto shadow-[0_0_20px_rgba(22,163,74,0.3)] flex items-center justify-center"
               >
                 {isSubmitting ? 'Traitement en cours...' : 'Confirmer mon rendez-vous'}
               </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
