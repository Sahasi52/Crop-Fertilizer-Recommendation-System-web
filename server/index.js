import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import { connectToDatabase } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "https://agrisense-web.netlify.app",
  })
);
app.use(express.json());
app.use("/auth", authRouter);
app.get("/", (req, res) => {
  res.send("Backend is running!");
});
app.get("/test-db", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json({ result: rows[0].result });
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
