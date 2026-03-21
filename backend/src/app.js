import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// API routes
app.use("/api", routes);

// Global error handling middleware
app.use(errorHandler)


export default app;