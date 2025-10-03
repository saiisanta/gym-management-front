// server.cjs
const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "src/mock/db.json"));
const middlewares = jsonServer.defaults();

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

// 🔄 Rutas API restantes
server.use("/api", router);

server.listen(4000, () => {
  console.log("JSON Server corriendo en http://localhost:4000");
});
