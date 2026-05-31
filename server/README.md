# 🌾Crop-Fertilizer-Recommendation-System-web

This project contains a frontend built with **Vite + React + Tailwind CSS**, and a backend built with **Node.js + Express + MySQL**.

---

## 📁 Project Structure

root/
├── frontend/ # Vite + React + Tailwind CSS

└── server/ # Node.js + Express + MySQL

---

## ⚙️ Frontend Setup

1. **Open Terminal**

2. Navigate to your project directory:

   ```bash
   cd path/to/your/project

   ```

3. Create a new Vite project:

   ```bash
   npm create vite@latest

   ```

4. Follow prompts:

   - Confirm: `y`

   - Project name: `frontend`

   - Framework: `React`

   - Variant: `JavaScript`

5. Move into the project:

   ```bash
   cd frontend

   ```

6. Install dependencies:

   ```bash
   npm install

   ```

7. Install useful libraries:

   ```bash
   npm install axios react-router-dom tailwindcss postcss autoprefixer

   ```

8. Initialize Tailwind:

   ```bash
   npx tailwindcss init -p

   //If you face any issue, run:
   npm install tailwindcss @tailwindcss/vite

   ```

9. Update `vite.config.js`:

   ```bash
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import tailwindcss from '@tailwindcss/vite'

   export default defineConfig({
      plugins: [
         react(),
         tailwindcss(),
      ],
   })

   ```

10. Update `src/index.css`:

    ```bash
    @import "tailwindcss/base";
    @import "tailwindcss/components";
    @import "tailwindcss/utilities";

    ```

11. Run the app:
    ```bash
    npm run dev
    ```

---

## 🔧 Backend Setup

1. Open a new terminal

2. Create and enter the backend folder:

   ```bash
   mkdir server
   cd server

   ```

3. Initialize the project:

   ```bash
   npm init -y

   ```

4. Install backend dependencies:

   ```bash
   npm install express cors bcrypt jsonwebtoken mysql2 nodemon

   ```

5. Create the entry file:

   ```bash
   touch index.js

   ```

6. Edit `package.json`:

   ```bash
   "scripts": {
     "start": "nodemon --env-file=.env index.js"
   },
   "type": "module"

   ```

7. Add starter code to `index.js`:

   ```bash
   import express from "express";

   const app = express();
   const PORT = 5000;

   app.use(express.json());

   app.listen(PORT, () => {
     console.log(`Server is running on http://localhost:${PORT}`);
   });

   ```

8. Run the backend:
   ```bash
   npm start
   ```

---

## ✅ Ready to Develop!

- Frontend: `http://localhost:5173`

- Backend: `http://localhost:5000`

You can now start building components and API routes!
