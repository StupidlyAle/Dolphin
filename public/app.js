// --- Login page ---
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
        errorEl.textContent = data.error || "Login error";
        errorEl.hidden = false;
        return;
      }

      window.location.href = "/results.html";
    } catch (err) {
      errorEl.textContent = "Unable to reach the server";
      errorEl.hidden = false;
    }
  });
}

// --- Results page ---
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
    content.innerHTML = "<p class='loading'>Unable to load results.</p>";
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
  const overallMet = semesters.every((sem) => sem.requirementsMet);

  let html = `
    <div class="student-card">
      <h1>${student.name}</h1>
      <p>Student number: ${student.studentNumber}</p>
      <p>Programme: ${student.programme}</p>
      <p>${student.year}</p>
      <button id="download-btn" class="download-btn">Download report</button>
    </div>
  `;

  semesters.forEach((sem) => {
    html += `
      <section class="semester-block">
        <div class="semester-header">
          <h2>${sem.name}</h2>
          <span class="semester-credits">
            ${sem.achievedCredits}/${sem.totalCredits} ECTS Obtained
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Course</th>
              <th class="numeric">ECTS</th>
              <th class="numeric">Result</th>
              <th class="numeric">Achieved</th>
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

  if (!overallMet) {
    html += `<p class="overall-status">Programme requirements are not met yet.</p>`;
  }

  content.innerHTML = html;

  const downloadBtn = document.getElementById("download-btn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => downloadReport(student));
  }
}

function downloadReport(student) {
  const originalTitle = document.title;
  document.title = `${student.studentNumber}_INF1_Progress_Report_Y1`;

  const restoreTitle = () => {
    document.title = originalTitle;
    window.removeEventListener("afterprint", restoreTitle);
  };
  window.addEventListener("afterprint", restoreTitle);

  window.print();
}if (content) {
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
    content.innerHTML = "<p class='loading'>Unable to load results.</p>";
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
      <p>Student number: ${student.studentNumber}</p>
      <p>Programme: ${student.programme}</p>
      <p>${student.year}</p>
    </div>
  `;

  semesters.forEach((sem) => {
    const metClass = sem.requirementsMet ? "met" : "not-met";
    const metLabel = sem.requirementsMet
      ? "Requirements met"
      : "Requirements not yet met";

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
              <th>Code</th>
              <th>Course</th>
              <th class="numeric">ECTS</th>
              <th class="numeric">Result</th>
              <th class="numeric">Achieved</th>
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
