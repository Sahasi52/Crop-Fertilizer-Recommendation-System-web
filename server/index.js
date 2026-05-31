import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import connectDB from "./lib/mongodb.js";

const app = express();
const PORT = process.env.PORT || 3306;

// connect mongodb
connectDB();

app.use(
  cors({
    origin: "https://agrisense-web.netlify.app",
  }),
);
app.use(express.json());
app.use("/auth", authRouter);
app.get("/", (req, res) => {
  res.send("Backend running");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
