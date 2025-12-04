index.js***import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 3306;

app.use(
  cors({
    origin: "https://agrisense-web.netlify.app",
  })
);
app.use(express.json());
app.use("/auth", authRouter);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
