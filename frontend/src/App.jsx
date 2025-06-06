import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CropRecom from "./pages/CropRecom";
import FertilizerRecom from "./pages/FertilizerRecom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/crop_recommendation" element={<CropRecom />}></Route>
        <Route
          path="/fertilizer_recommendation"
          element={<FertilizerRecom />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
