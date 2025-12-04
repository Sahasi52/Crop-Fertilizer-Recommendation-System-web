import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";

const app = express();

app.use(
  cors({
    origin: "https://agrisense-web.netlify.app",
  })
);
app.use(express.json());
app.use("/auth", authRouter);
app.listen(process.env.PORT, () => {
  console.log("Server is running...");
});
