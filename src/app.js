import dotenv from 'dotenv'
dotenv.config()

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import newsRoutes from "./routes/newsRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import agendaRoutes from "./routes/agendaRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import extracurricularRoutes from "./routes/extracurricularRoutes.js";
import osisRoutes from "./routes/osisRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 5000;

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://smpn1ngariboyo.sch.id",
  "https://www.smpn1ngariboyo.sch.id",
  ...(process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server Backend SMPN 1 Ngariboyo Berjalan!",
  });
});

app.get("/api", (req, res) => {
  res.json({
    status: "success",
    message: "Backend API SMP Negeri 1 Ngariboyo sudah aktif 🚀",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/agendas", agendaRoutes);
app.use("/api/galleries", galleryRoutes);
app.use("/api/extracurriculars", extracurricularRoutes);
app.use("/api/osis", osisRoutes);

app.listen(PORT, () => {
  console.log(`Server aktif di http://localhost:${PORT}`);
});