import { Router } from "express";
import authRoutes from './auth.route.js'
import userRoutes from './user.route.js'
import farmRoutes from './farm.route.js'
import campaignRoutes from './campaign.route.js'
import animalRoutes from './animal.route.js'
import productRoutes from './product.route.js'
import transactionRoutes from './transaction.route.js'
import healthRoutes from './health.route.js'
import saleRoutes from './sale.route.js'
import reportRoutes from './report.route.js'
import settingsRoutes from './settings.route.js'
import eventRoutes from './event.route.js'

const router = Router()

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/farms", farmRoutes)
router.use("/campaigns", campaignRoutes)
router.use("/animals", animalRoutes)
router.use("/products", productRoutes)
router.use("/transactions", transactionRoutes)
router.use("/health", healthRoutes)
router.use("/sales", saleRoutes)
router.use("/reports", reportRoutes)
router.use("/settings", settingsRoutes)
router.use("/events", eventRoutes)

export default router;