import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/User.js";
import Farm from "../src/models/Farm.js";
import Campaign from "../src/models/Campaign.js";
import Animal from "../src/models/Animal.js";
import bcryptjs from "bcryptjs";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { dbName: process.env.DB_NAME });
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    // await User.deleteMany({});
    // await Farm.deleteMany({});
    // await Campaign.deleteMany({});
    // await Animal.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      name: "Admin FermeApp",
      email: "admin@admin.com",
      passwordHash: await bcryptjs.hash("123456789", 10),
      role: "admin",
      actif: true,
    });

    // Create gérant user
    // const gerantUser = await User.create({
    //   name: "Gérant Test",
    //   email: "gerant@fermeapp.com",
    //   passwordHash: await bcryptjs.hash("123456789", 10),
    //   role: "gerant",
    //   actif: true,
    // });

    // Create agent user
    // const agentUser = await User.create({
    //   name: "Agent Test",
    //   email: "agent@fermeapp.com",
    //   passwordHash: await bcryptjs.hash("Agent123!", 10),
    //   role: "agent",
    //   actif: true,
    // });

    console.log("✅ Users created successfully");

    // Create test farms
    // const farm1 = await Farm.create({
    //   name: "Ferme du Soleil",
    //   location: "Dakar, Sénégal",
    //   coordinates: { latitude: 14.6937, longitude: -17.4441 },
    //   owner: adminUser._id,
    //   managers: [gerantUser._id],
    //   agents: [agentUser._id],
    //   totalArea: 50,
    //   productionTypes: ["Volaille", "Bétail"],
    //   active: true,
    // });

    // const farm2 = await Farm.create({
    //   name: "Ferme Aquatique",
    //   location: "Saint-Louis, Sénégal",
    //   coordinates: { latitude: 16.0179, longitude: -16.4896 },
    //   owner: adminUser._id,
    //   managers: [gerantUser._id],
    //   agents: [],
    //   totalArea: 30,
    //   productionTypes: ["Pisciculture"],
    //   active: true,
    // });

    // console.log("✅ Farms created successfully");

    // // Create test campaigns
    // const campaign1 = await Campaign.create({
    //   name: "Campagne Volaille Mars 2026",
    //   farm: farm1._id,
    //   animalType: "Volaille",
    //   status: "En cours",
    //   startDate: new Date("2026-03-01"),
    //   initialAnimalCount: 500,
    //   currentAnimalCount: 480,
    //   deaths: 20,
    //   mortality: 4,
    //   feedConsumed: 1200,
    //   feedCost: 280000,
    //   expectedRevenue: 650000,
    //   actualRevenue: 0,
    //   fcr: 2.5,
    //   budget: 620000,
    //   spent: 620000,
    //   managers: [gerantUser._id],
    //   agents: [agentUser._id],
    // });

    // const campaign2 = await Campaign.create({
    //   name: "Campagne Bétail Avril 2026",
    //   farm: farm1._id,
    //   animalType: "Bétail",
    //   status: "Préparation",
    //   startDate: new Date("2026-04-01"),
    //   initialAnimalCount: 200,
    //   currentAnimalCount: 200,
    //   deaths: 0,
    //   mortality: 0,
    //   feedConsumed: 0,
    //   feedCost: 0,
    //   expectedRevenue: 800000,
    //   actualRevenue: 0,
    //   fcr: 0,
    //   budget: 400000,
    //   spent: 0,
    //   managers: [gerantUser._id],
    //   agents: [agentUser._id],
    // });

    // const campaign3 = await Campaign.create({
    //   name: "Campagne Pisciculture Mars 2026",
    //   farm: farm2._id,
    //   animalType: "Pisciculture",
    //   status: "En cours",
    //   startDate: new Date("2026-03-15"),
    //   initialAnimalCount: 1000,
    //   currentAnimalCount: 950,
    //   deaths: 50,
    //   mortality: 5,
    //   feedConsumed: 800,
    //   feedCost: 120000,
    //   expectedRevenue: 300000,
    //   actualRevenue: 0,
    //   fcr: 1.2,
    //   budget: 250000,
    //   spent: 180000,
    //   managers: [gerantUser._id],
    //   agents: [],
    // });

    // console.log("✅ Campaigns created successfully");

    // // Create test animals for campaigns
    // try {
    //   // Animals for campaign 1 (Volaille) - 20 animals
    //   for (let i = 1; i <= 20; i++) {
    //     await Animal.create({
    //       campaign: campaign1._id,
    //       idNumber: `VOL-${campaign1._id}-${String(i).padStart(3, '0')}`,
    //       type: "Volaille",
    //       breed: "Ross 308",
    //       dateOfBirth: new Date("2026-03-01"),
    //       weight: 2.1 + Math.random() * 0.5,
    //       healthStatus: i <= 18 ? "Sain" : "Malade",
    //       location: "Lot A",
    //       vaccinations: [
    //         { vaccine: "Newcastle", date: new Date("2026-03-05"), nextDue: new Date("2026-04-05") }
    //       ]
    //     });
    //   }

    //   // Animals for campaign 2 (Bétail) - 10 animals
    //   for (let i = 1; i <= 10; i++) {
    //     await Animal.create({
    //       campaign: campaign2._id,
    //       idNumber: `BET-${campaign2._id}-${String(i).padStart(3, '0')}`,
    //       type: "Bétail",
    //       breed: "Zébu",
    //       dateOfBirth: new Date("2025-06-01"),
    //       weight: 180 + Math.random() * 50,
    //       healthStatus: "Sain",
    //       location: `Lot ${String.fromCharCode(65 + ((i - 1) % 3))}`,
    //       vaccinations: [
    //         { vaccine: "CBPP", date: new Date("2026-03-10"), nextDue: new Date("2027-03-10") }
    //       ]
    //     });
    //   }

    //   // Animals for campaign 3 (Pisciculture) - 30 animals
    //   for (let i = 1; i <= 30; i++) {
    //     await Animal.create({
    //       campaign: campaign3._id,
    //       idNumber: `POISSON-${campaign3._id}-${String(i).padStart(3, '0')}`,
    //       type: "Pisciculture",
    //       breed: "Tilapia",
    //       dateOfBirth: new Date("2026-03-15"),
    //       weight: 0.15 + Math.random() * 0.1,
    //       healthStatus: i <= 28 ? "Sain" : "Suspect",
    //       location: "Bassin 1",
    //       vaccinations: []
    //     });
    //   }

      console.log("✅ Animals created successfully (60 total)");
    } catch (animalErr) {
      console.error("❌ Error creating animals:", animalErr.message);
    }
    console.log("\n🎉 Seed completed! Database is ready.");
    console.log("📊 Login credentials:");
    console.log("   Admin: admin@fermeapp.com / Admin123!");
    console.log("   Gérant: gerant@fermeapp.com / Gerant123!");
    console.log("   Agent: agent@fermeapp.com / Agent123!");
    console.log("");
    console.log("📋 Test data created:");
    console.log("   - 2 Farms (Ferme du Soleil, Ferme Aquatique)");
    console.log("   - 3 Campaigns (Volaille, Bétail, Pisciculture)");
    console.log("   - 60 Animals (20 Volaille, 10 Bétail, 30 Pisciculture)");
    console.log("   - Gérant assigned to all farms");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedDatabase();