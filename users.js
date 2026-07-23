// Utenti hardcoded per il login.
// La password NON è salvata in chiaro: è un hash bcrypt.
// Per generare l'hash di una nuova password esegui:
//   npm run hash-password -- "laTuaPasswordSegreta"
// e incolla il risultato qui sotto in "passwordHash".

module.exports = [
  {
    username: "astrano",
    // password di default: "changeme123"
    // CAMBIALA generando un nuovo hash prima di usare l'app sul serio!
    passwordHash: "$2a$10$6LDcGitARxNOvJTomDYWo.JPG/co6l4PGIAwV8IDY9F7mI47IsQh.",
    displayName: "A. Strano"
  }
];
