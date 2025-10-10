const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "src/mock/db.json"));
const middlewares = jsonServer.defaults();

// ✅ Node 18+ tiene fetch global, si usas Node <18 descomenta esta línea:
// const fetch = async (...args) => { const { default: fetchFn } = await import('node-fetch'); return fetchFn(...args); }

server.use(middlewares);
server.use(jsonServer.bodyParser);

// 🔑 Login
server.post("/api/Auth/login", (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get("usuarios").value();

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({
      userId: user.id,
      role: user.roleId,
      token: "fake-jwt-token",
      email: user.email,
      nombre: user.nombre,
      lastname: user.lastname,
      telNumber: user.telNumber, 
      plan: user.plan            
    });
  } else {
    res.status(401).json({ message: "Credenciales inválidas" });
  }
});

// 📝 Registro de usuario
server.post("/api/Auth/register", (req, res) => {
  const { nombre, lastname, email, password, roleId, telNumber, plan } = req.body;
  const users = router.db.get("usuarios");

  if (users.find({ email }).value()) {
    return res.status(400).json({ message: "El email ya está registrado" });
  }

  const newUser = {
    id: Date.now(),
    nombre,
    lastname,
    email,
    password,
    roleId: roleId || 4,
    telNumber: telNumber || null,
    plan: plan || null
  };

  users.push(newUser).write();
  res.status(201).json(newUser);
});

// Geocoding Proxy
server.get("/api/geocode", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query 'q' requerida" });

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "HighFitApp/1.0 (simisantarelli@gmail.com)",
          "Accept-Language": "es",
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Nominatim error:", response.status, text);
      return res.status(response.status).json({ error: "Error de Nominatim" });
    }

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error("Error geocoding:", err);
    res.status(500).json({ error: "Error al obtener coordenadas" });
  }
});

// 🔄 Rutas API restantes
server.use("/api", router);

server.listen(4000, () => {
  console.log("JSON Server corriendo en http://localhost:4000");
});
