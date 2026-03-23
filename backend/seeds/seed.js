import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/User.js";
import bcryptjs from "bcryptjs";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { dbName: process.env.DB_NAME });
    console.log("✅ Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});

    // Create admin user only
    const adminUser = await User.create({
      name: "Admin FermeApp",
      email: "admin@fermeapp.com",
      passwordHash: await bcryptjs.hash("Admin123!", 10),
      role: "admin",
      actif: true,
    });

    console.log("✅ Admin user created successfully");
    console.log("📊 Login credentials:");
    console.log("   Email: admin@fermeapp.com");
    console.log("   Password: Admin123!");
    console.log("");
    console.log("🎉 Seed completed! Database is ready.");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedDatabase();