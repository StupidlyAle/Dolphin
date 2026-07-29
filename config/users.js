// Utenti hardcoded per il login.
// La password NON è salvata in chiaro: è un hash bcrypt.
// Per generare l'hash di una nuova password esegui:
//   npm run hash-password -- "laTuaPasswordSegreta"
// e incolla il risultato qui sotto in "passwordHash".

module.exports = [
  {
    username: "5918200",
    passwordHash: "$2a$10$9KE0BbY9skj.2ejhu2sqk.EcOpkmSvnKLseotNIUmpSo0zY3nCnni",
    displayName: "A. Strano"
  }
];
