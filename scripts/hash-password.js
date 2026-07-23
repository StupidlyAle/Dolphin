// Genera l'hash bcrypt di una password da mettere in config/users.js
// Uso: npm run hash-password -- "laTuaPassword"
const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error("Uso: npm run hash-password -- \"laTuaPassword\"");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nCopia questo hash in config/users.js come valore di passwordHash:\n");
console.log(hash);
console.log("");
