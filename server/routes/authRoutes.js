import express from "express";
import { connectToDatabase } from "../lib/db.js";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashPassword]
    );

    return res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });
    return res.status(201).json({ token: token });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.post("/crop_recommendation", async (req, res) => {
  const { nitrogen, phosphorus, potassium, temperature, humidity, ph_level } =
    req.body;

  try {
    const mlResponse = await fetch(
      "https://crop-recommendation-ml-backend-2.onrender.com/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          N: nitrogen,
          P: phosphorus,
          K: potassium,
          temperature: temperature,
          humidity: humidity,
          ph: ph_level,
        }),
      }
    );

    const data = await mlResponse.json();

    if (data.recommendations && Array.isArray(data.recommendations)) {
      console.log("Recommended crops:", data.recommendations);

      return res.status(200).json({
        recommendations: data.recommendations.map((rec) => ({
          crop: rec.crop,
          probability: rec.probability.toFixed(2) + "%",
        })),
      });
    } else {
      return res.status(200).json({
        recommendations: [],
        message: "No recommendations found",
      });
    }
  } catch (err) {
    console.error("Error in crop recommendation:", err);
    return res.status(500).json({ message: "Crop recommendation failed" });
  }
});

router.post("/fertilizer_recommendation", async (req, res) => {
  const { crop_name } = req.body;
  if (!crop_name) {
    return res.status(400).json({ message: "Crop name is required." });
  }

  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(
      "SELECT recommendation FROM fertilizers WHERE crop_name = ? LIMIT 1",
      [crop_name]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No fertilizer recommendation found." });
    }

    res.status(200).json({ recommendation: rows[0].recommendation });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.post("/add", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashPassword]
    );

    return res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

router.put("/update/:id", async (req, res) => {
  const { username, email, password } = req.body;
  const id = req.params.id;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    const user = rows[0];
    let hashPassword = user.password;
    if (password && password.trim() !== "") {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return res.status(400).json({
          message: "Please use a different password.",
        });
      }
      hashPassword = await bcrypt.hash(password, 10);
    }

    await db.query(
      "UPDATE users SET `username` = ?, `email` = ?, `password` = ? WHERE id = ?",
      [username, email, hashPassword, id]
    );

    return res.status(201).json({ message: "User updated successfully." });
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
};

router.get("/home", verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
      req.userId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }

    return res.status(201).json({ user: rows[0] });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

router.get("/about", verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
      req.userId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }

    return res.status(201).json({ user: rows[0] });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

router.get("/contact", verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
      req.userId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }

    return res.status(201).json({ user: rows[0] });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

router.get("/crop_recommendation", verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
      req.userId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }

    return res.status(201).json({ user: rows[0] });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

router.get("/fertilizer_recommendation", verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
      req.userId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }

    return res.status(201).json({ user: rows[0] });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

router.get("/admin", verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
      req.userId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    const user = rows[0];
    if (user.email !== "admin@gmail.com") {
      return res.status(403).json({ message: "Unauthorized!" });
    }

    const [cols] = await db.query("SELECT * FROM users");
    return res.status(200).json(cols);
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
});

router.get("/add", verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
      req.userId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    const user = rows[0];
    if (user.email !== "admin@gmail.com") {
      return res.status(403).json({ message: "Unauthorized!" });
    }

    const [cols] = await db.query("SELECT * FROM users");
    return res.status(200).json(cols);
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
});

router.get("/update/:id", verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
      req.userId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    const user = rows[0];
    if (user.email !== "admin@gmail.com") {
      return res.status(403).json({ message: "Unauthorized!" });
    }

    const id = parseInt(req.params.id);
    const [cols] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return res.json(cols[0]);
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
});

router.delete("/admin/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    const db = await connectToDatabase();
    const [row] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return res.status(201).json({ message: "User deleted successfully." });
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

export default router;
