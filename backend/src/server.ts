import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "BizFlow API is running",
  });
});

app.listen(PORT, () => {
  console.log(`BizFlow API running on http://localhost:${PORT}`);
});