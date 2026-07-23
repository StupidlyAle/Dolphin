// --- Pagina di login ---
const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const errorEl = document.getElementById("error-message");
    errorEl.hidden = true;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok) {
        errorEl.textContent = data.error || "Errore di accesso";
        errorEl.hidden = false;
        return;
      }

      window.location.href = "/results.html";
    } catch (err) {
      errorEl.textContent = "Impossibile contattare il server";
      errorEl.hidden = false;
    }
  });
}

// --- Pagina dei risultati ---
const content = document.getElementById("content");

if (content) {
  init();
}

async function init() {
  const meRes = await fetch("/api/me");
  const me = await meRes.json();

  if (!me.loggedIn) {
    window.location.href = "/index.html";
    return;
  }

  document.getElementById("user-name").textContent = me.displayName;
  document.getElementById("logout-btn").addEventListener("click", logout);

  const res = await fetch("/api/results");
  if (!res.ok) {
    content.innerHTML = "<p class='loading'>Impossibile caricare i risultati.</p>";
    return;
  }

  const data = await res.json();
  renderResults(data);
}

async function logout() {
  await fetch("/api/logout", { method: "POST" });
  window.location.href = "/index.html";
}

function formatResult(result) {
  if (result === "-" || result === undefined) return "-";
  if (result === "PA") return `<span class="result-pass">PA</span>`;
  const num = parseFloat(result);
  if (!isNaN(num)) {
    const cls = num >= 5.5 ? "result-pass" : "result-fail";
    return `<span class="${cls}">${result}</span>`;
  }
  return result;
}

function renderResults(data) {
  const { student, semesters } = data;

  let html = `
    <div class="student-card">
      <h1>${student.name}</h1>
      <p>Numero studente: ${student.studentNumber}</p>
      <p>Programma: ${student.programme}</p>
      <p>${student.year}</p>
    </div>
  `;

  semesters.forEach((sem) => {
    const metClass = sem.requirementsMet ? "met" : "not-met";
    const metLabel = sem.requirementsMet
      ? "Requisiti soddisfatti"
      : "Requisiti non ancora soddisfatti";

    html += `
      <section class="semester-block">
        <div class="semester-header">
          <h2>${sem.name}</h2>
          <span class="semester-credits ${metClass}">
            ${sem.achievedCredits}/${sem.totalCredits} ECTS &middot; ${metLabel}
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Codice</th>
              <th>Corso</th>
              <th class="numeric">ECTS</th>
              <th class="numeric">Risultato</th>
              <th class="numeric">Ottenuti</th>
            </tr>
          </thead>
          <tbody>
    `;

    sem.courses.forEach((course) => {
      html += `
        <tr class="course-row">
          <td>${course.code}</td>
          <td>${course.title}</td>
          <td class="numeric">${course.ects}</td>
          <td class="numeric">${formatResult(course.result)}</td>
          <td class="numeric">${course.achieved}</td>
        </tr>
      `;
      (course.subItems || []).forEach((sub) => {
        html += `
          <tr class="sub-row">
            <td>${sub.code}</td>
            <td>${sub.title}</td>
            <td class="numeric"></td>
            <td class="numeric">${formatResult(sub.result)}</td>
            <td class="numeric"></td>
          </tr>
        `;
      });
    });

    html += `
          </tbody>
        </table>
      </section>
    `;
  });

  content.innerHTML = html;
}
