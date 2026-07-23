# Progress (clone) — Risultati esami

App web che replica l'interfaccia di Progress (il sistema di visualizzazione voti delle università olandesi), con login hardcoded e dati salvati in un file JSON (nessun database server, nessun Docker).

## Struttura del progetto

```
progress-app/
├── server.js              # server Express: login, sessioni, API
├── config/
│   └── users.js           # utenti hardcoded (password come hash bcrypt)
├── data/
│   └── results.json       # i tuoi risultati (corsi, ECTS, voti)
├── scripts/
│   └── hash-password.js   # genera l'hash per una nuova password
└── public/                # frontend statico
    ├── index.html         # pagina di login
    ├── results.html        # pagina dei risultati
    ├── style.css
    └── app.js
```

## Come avviarlo su Termux (tablet Android)

1. Installa Termux da F-Droid (non dal Play Store, versione deprecata).
2. Nel terminale Termux:
   ```
   pkg update && pkg install nodejs
   ```
3. Copia la cartella `progress-app` sul tablet (es. con `termux-setup-storage` + copia da Download, oppure `git clone` se il progetto è su un repo).
4. Entra nella cartella e installa le dipendenze:
   ```
   cd progress-app
   npm install
   ```
5. Avvia il server:
   ```
   npm start
   ```
6. Apri il browser del tablet su `http://localhost:3000`.

## Come avviarlo su desktop

Stessi passaggi: serve solo Node.js installato (da nodejs.org), poi `npm install` e `npm start` nella cartella del progetto. Nessuna configurazione aggiuntiva, nessun database da installare: i dati sono nel file `data/results.json`.

## Login

Utente di default:
- **username:** `astrano`
- **password:** `changeme123`

**Cambia subito la password** prima di usare l'app sul serio:
```
npm run hash-password -- "laTuaNuovaPassword"
```
Copia l'hash stampato in `config/users.js`, sostituendo il valore di `passwordHash`.

Per aggiungere altri utenti, aggiungi altri oggetti `{ username, passwordHash, displayName }` all'array esportato da `config/users.js`.

## Modificare i voti

Basta modificare `data/results.json` con un qualsiasi editor di testo (anche direttamente sul tablet) — non serve nessun database manager. La struttura è:

```json
{
  "student": { "name": "...", "studentNumber": "...", "programme": "...", "year": "..." },
  "semesters": [
    {
      "name": "Semester 1",
      "achievedCredits": 30,
      "totalCredits": 60,
      "requirementsMet": true,
      "courses": [
        {
          "code": "DBS1_I01",
          "title": "Database Systems 1",
          "ects": 5,
          "result": "7.1",
          "achieved": 5,
          "subItems": [
            { "code": "DBS1TI01", "title": "Theory DBS1", "result": "7.1" }
          ]
        }
      ]
    }
  ]
}
```

## Note di sicurezza

- Cambia la stringa `secret` in `server.js` (usata per firmare le sessioni) prima di mettere l'app online.
- Se esponi l'app su internet (non solo in rete locale), usa HTTPS — ad esempio dietro un reverse proxy come Caddy o Nginx, oppure con un servizio come Cloudflare Tunnel.
