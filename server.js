import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const NODE_ENV = process.env.NODE_ENV || "production";
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// EJS configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Routes
app.get("/", (req, res) => {
  res.render("home", { title: "Welcome Home" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Me" });
});

app.get("/products", (req, res) => {
  res.render("products", { title: "Our Products" });
});

app.get("/student", (req, res) => {
  const student = {
    name: "Elora Mathias",
    id: "S12345678",
    email: "elora.mathias@example.com",
    address: "123 Main St, Rexburg, ID 83440"
  };

  res.render("student", { title: "Student Information", student });
});

app.listen(PORT, () => {
  console.log(`NODE_ENV: ${NODE_ENV}`);
  console.log(`Server running at http://localhost:${PORT}`);
});
