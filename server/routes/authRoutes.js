import express from "express";
import user from "../models/User.js";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new user({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const OldUser = await user.findOne({ email });
    if (!OldUser) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }

    const isMatch = await bcrypt.compare(password, OldUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = jwt.sign({ id: OldUser._id }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });

    res.status(200).json({ token });
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
      },
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
  const { crop, N, P, K, temperature, humidity, ph } = req.body;

  if (!crop || !N || !P || !K || !temperature || !humidity || !ph) {
    return res.status(400).json({ message: "All input fields are required." });
  }

  try {
    const mlResponse = await fetch(
      "https://crop-recommendation-ml-backend-2.onrender.com/ml-fertility-recommendations",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop,
          N,
          P,
          K,
          temperature,
          humidity,
          ph,
        }),
      },
    );

    const data = await mlResponse.json();

    if (data.recommendations && Array.isArray(data.recommendations)) {
      console.log("Fertilizer recommendations:", data.recommendations);

      return res.status(200).json({
        crop: data.crop,
        current_parameters: data.current_parameters,
        predicted_ideal: data.predicted_ideal,
        recommendations: data.recommendations,
      });
    } else {
      return res.status(200).json({
        recommendations: [],
        message: "No fertilizer recommendations found",
      });
    }
  } catch (err) {
    console.error("Error in fertilizer recommendation:", err);
    return res
      .status(500)
      .json({ message: "Fertilizer recommendation failed" });
  }
});

router.post("/add", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await user.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists!",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new user({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User created successfully.",
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

router.put("/update/:id", async (req, res) => {
  const { username, email, password } = req.body;
  const id = req.params.id;

  try {
    const ExistingUser = await user.findById(id);

    if (!ExistingUser) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    let hashPassword = ExistingUser.password;

    if (password && password.trim() !== "") {
      const isMatch = await bcrypt.compare(password, ExistingUser.password);

      if (isMatch) {
        return res.status(400).json({
          message: "Please use a different password.",
        });
      }

      hashPassword = await bcrypt.hash(password, 10);
    }

    await user.findByIdAndUpdate(id, {
      username,
      email,
      password: hashPassword,
    });

    return res.status(200).json({
      message: "User updated successfully.",
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(403).json({
        message: "No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req.userId = decoded.id;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

router.get("/home", verifyToken, async (req, res) => {
  try {
    const UserData = await user.findById(req.userId);

    if (!UserData) {
      return res.status(404).json({
        message: "User doesn't exist!",
      });
    }

    return res.status(200).json({
      user: UserData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error.",
    });
  }
});

router.get("/about", verifyToken, async (req, res) => {
  try {
    const UserData = await user.findById(req.userId);

    if (!UserData) {
      return res.status(404).json({
        message: "User doesn't exist!",
      });
    }

    return res.status(200).json({
      user: UserData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error.",
    });
  }
});

router.get("/contact", verifyToken, async (req, res) => {
  try {
    const UserData = await user.findById(req.userId);

    if (!UserData) {
      return res.status(404).json({
        message: "User doesn't exist!",
      });
    }

    return res.status(200).json({
      user: UserData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error.",
    });
  }
});

router.get("/crop_recommendation", verifyToken, async (req, res) => {
  try {
    const UserData = await user.findById(req.userId);

    if (!UserData) {
      return res.status(404).json({
        message: "User doesn't exist!",
      });
    }

    return res.status(200).json({
      user: UserData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error.",
    });
  }
});

router.get("/fertilizer_recommendation", verifyToken, async (req, res) => {
  try {
    const UserData = await user.findById(req.userId);

    if (!UserData) {
      return res.status(404).json({
        message: "User doesn't exist!",
      });
    }

    return res.status(200).json({
      user: UserData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error.",
    });
  }
});

router.get("/admin", verifyToken, async (req, res) => {
  try {
    const AdminUser = await user.findById(req.userId);

    if (!AdminUser) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    if (AdminUser.email !== "admin@gmail.com") {
      return res.status(403).json({
        message: "Unauthorized!",
      });
    }

    const AllUsers = await user.find();

    return res.status(200).json(AllUsers);
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
});

router.get("/add", verifyToken, async (req, res) => {
  try {
    const AdminUser = await user.findById(req.userId);

    if (!AdminUser) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    if (AdminUser.email !== "admin@gmail.com") {
      return res.status(403).json({
        message: "Unauthorized!",
      });
    }

    const AllUsers = await user.find();

    return res.status(200).json(AllUsers);
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
});

router.get("/update/:id", verifyToken, async (req, res) => {
  try {
    const AdminUser = await user.findById(req.userId);

    if (!AdminUser) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    if (AdminUser.email !== "admin@gmail.com") {
      return res.status(403).json({
        message: "Unauthorized!",
      });
    }

    const UserData = await user.findById(req.params.id);

    if (!UserData) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    return res.json(UserData);
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
});

router.delete("/admin/:id", verifyToken, async (req, res) => {
  try {
    await user.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

export default router;
