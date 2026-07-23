const express = require("express");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const users = require("./config/users");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  session({
    secret: "cambia-questa-stringa-segreta-in-produzione",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 8 // 8 ore
    }
  })
);

// Serve i file statici del frontend
app.use(express.static(path.join(__dirname, "public")));

// Middleware che protegge le rotte riservate
function requireLogin(req, res, next) {
  if (req.session && req.session.username) {
    return next();
  }
  return res.status(401).json({ error: "Non autenticato" });
}

// --- API: login ---
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username e password richiesti" });
  }

  const user = users.find((u) => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: "Credenziali non valide" });
  }

  req.session.username = user.username;
  req.session.displayName = user.displayName;

  res.json({ ok: true, displayName: user.displayName });
});

// --- API: stato sessione ---
app.get("/api/me", (req, res) => {
  if (req.session && req.session.username) {
    return res.json({
      loggedIn: true,
      displayName: req.session.displayName
    });
  }
  res.json({ loggedIn: false });
});

// --- API: logout ---
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

// --- API: risultati (protetta) ---
app.get("/api/results", requireLogin, (req, res) => {
  const dataPath = path.join(__dirname, "data", "results.json");
  fs.readFile(dataPath, "utf-8", (err, content) => {
    if (err) {
      return res.status(500).json({ error: "Impossibile leggere i risultati" });
    }
    res.json(JSON.parse(content));
  });
});

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
