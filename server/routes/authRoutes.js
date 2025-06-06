import express from "express";
import { connectToDatabase } from "../lib/db.js";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";

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
  const { nitrogen, phosphorus, potassium, ph_level, humidity, temperature } =
    req.body;

  if (
    [nitrogen, phosphorus, potassium, ph_level, humidity, temperature].some(
      (v) => v === undefined
    )
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const db = await connectToDatabase();

    const [rows] = await db.query(
      `
      SELECT name,
        POW((? - ((min_n + max_n)/2)), 2) +
        POW((? - ((min_p + max_p)/2)), 2) +
        POW((? - ((min_k + max_k)/2)), 2) +
        POW((? - ((min_ph + max_ph)/2)), 2) +
        POW((? - ((min_humidity + max_humidity)/2)), 2) +
        POW((? - ((min_temp + max_temp)/2)), 2) AS score
      FROM crops
      ORDER BY score ASC
      LIMIT 5
    `,
      [nitrogen, phosphorus, potassium, ph_level, humidity, temperature]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No suitable crops found." });
    }

    const recommendedCrops = rows.map((row) => row.name);
    res.status(200).json({ recommendations: recommendedCrops });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    res.status(500).json({ message: err.message });
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

export default router;
