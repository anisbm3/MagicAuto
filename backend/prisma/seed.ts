import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  try {
    // 1. Settings
    const existingSettings = await prisma.setting.findMany();
    if (existingSettings.length === 0) {
      await prisma.setting.create({
        data: {
          businessName: "MAGIC AUTO",
          phone: "+33 1 23 45 67 89",
          whatsapp: "+33 6 12 34 56 78",
          email: "contact@magicauto.com",
          address: "123 Avenue de l'Automobile, 75000 Paris",
          openingHours: "Lun-Sam: 9h-18h",
          seoTitle: "MAGIC AUTO | Premium Automotive Showroom",
          seoDescription: "Showroom automobile, lavage, entretien et esthétique.",
        },
      });
      console.log("Settings seeded.");
    }

    // 2. Super Admin
    const existingUsers = await prisma.user.findMany();
    if (existingUsers.length === 0) {
      const hashedPassword = await bcrypt.hash("AdminMagic", 10);
      await prisma.user.create({
        data: {
          username: "AdminMagic",
          password: hashedPassword,
          role: "SUPER_ADMIN",
          active: true,
        },
      });
      console.log("Super admin 'AdminMagic' created.");
    }

    // 3. Vehicles
    const existingVehicles = await prisma.vehicle.findMany();
    if (existingVehicles.length === 0) {
      await prisma.vehicle.createMany({
        data: [
          {
            brand: "Mercedes-Benz",
            model: "Classe A 200 AMG Line",
            slug: "mercedes-classe-a-200-amg",
            price: 32500,
            year: 2021,
            mileage: 45000,
            fuel: "Essence",
            transmission: "Automatique",
            engine: "1.3",
            power: "163",
            color: "Gris Montagne Métallisé",
            bodyType: "Berline",
            description: "Superbe Mercedes Classe A finition AMG Line. Entretien complet réseau Mercedes.",
            equipment: "Toit ouvrant panoramique, Double écran 10.25, Jantes AMG 18, Pack Premium, Caméra de recul",
            images:
              "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80",
            featured: true,
            status: "Disponible",
          },
          {
            brand: "BMW",
            model: "Série 3 320d M Sport",
            slug: "bmw-serie-3-320d-msport",
            price: 38900,
            year: 2022,
            mileage: 32000,
            fuel: "Diesel",
            transmission: "Automatique",
            engine: "2.0",
            power: "190",
            color: "Saphirschwarz",
            bodyType: "Berline",
            description: "BMW Série 3 dernière génération, finition M Sport très équipée.",
            equipment: "Pack M Sport, HUD, Harman Kardon, Feux Laser, Accès confort",
            images:
              "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80",
            featured: true,
            status: "Disponible",
          },
          {
            brand: "Audi",
            model: "Q3 Sportback 35 TFSI S line",
            slug: "audi-q3-sportback-sline",
            price: 41500,
            year: 2023,
            mileage: 18500,
            fuel: "Hybride",
            transmission: "Automatique S tronic",
            engine: "1.5",
            power: "150",
            color: "Gris Daytona",
            bodyType: "SUV",
            description: "Audi Q3 Sportback état neuf. Véhicule collaborateur.",
            equipment: "Pack S line intérieur/extérieur, Virtual Cockpit Plus, Matrix LED",
            images: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&q=80",
            featured: false,
            status: "Disponible",
          },
        ],
      });
      console.log("Vehicles seeded.");
    }

    // 4. Services
    const existingServices = await prisma.service.findMany();
    if (existingServices.length === 0) {
      await prisma.service.createMany({
        data: [
          {
            name: "Lavage Premium Extérieur",
            category: "Lavage",
            description: "Lavage manuel détaillé de la carrosserie, des jantes et vitres extérieures.",
            price: 40,
            duration: "1h",
            active: true,
            featured: true,
          },
          {
            name: "Nettoyage Complet Intérieur/Extérieur",
            category: "Lavage",
            description:
              "Formule intégrale : aspiration profonde, pressing des sièges, plastiques et lavage carrosserie.",
            price: 120,
            duration: "2h30",
            active: true,
            featured: true,
          },
          {
            name: "Vidange & Filtres",
            category: "Entretien",
            description: "Remplacement de l'huile moteur, du filtre à huile et remise à zéro des indicateurs.",
            price: 150,
            duration: "1h30",
            active: true,
            featured: true,
          },
          {
            name: "Révision Complète Constructeur",
            category: "Entretien",
            description: "Entretien complet selon les préconisations du constructeur de votre véhicule.",
            price: 280,
            active: true,
            featured: false,
          },
          {
            name: "Lustrage & Polissage (Correction Micro-rayures)",
            category: "Esthétique",
            description: "Correction des défauts mineurs de la peinture pour lui redonner sa brillance d'origine.",
            price: 350,
            duration: "1 jour",
            active: true,
            featured: true,
          },
          {
            name: "Traitement Céramique",
            category: "Esthétique",
            description: "Protection hydrophobe et anti-rayures longue durée (jusqu'à 5 ans) de la carrosserie.",
            price: 890,
            duration: "2 jours",
            active: true,
            featured: false,
          },
        ],
      });
      console.log("Services seeded.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
