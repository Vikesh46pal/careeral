document.addEventListener("DOMContentLoaded", () => {
  function qs(id) {
    return document.getElementById(id);
  }
  function splitLines(val) {
    return (val || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Renderers
  function renderSkills(csv) {
    const skills = (csv || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const ul = qs("p_skills");
    if (!ul) return;
    ul.innerHTML = "";
    skills.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s;
      ul.appendChild(li);
    });
  }

  function renderExperience(text) {
    const wrap = qs("p_experience");
    if (!wrap) return;
    wrap.innerHTML = "";
    const lines = splitLines(text);
    if (!lines.length) {
      wrap.textContent = "—";
      return;
    }
    lines.forEach((line) => {
      // Company | Role | YYYY–YYYY | City | A; B; C
      const parts = line.split("|").map((x) => x.trim());
      if (parts.length < 5) {
        const div = document.createElement("div");
        div.className = "exp-item";
        div.textContent = line;
        wrap.appendChild(div);
        return;
      }
      const [company, role, years, city, achievements] = parts;

      const item = document.createElement("div");
      item.className = "exp-item";
      item.innerHTML = `
    <div class="exp-top">
      <div>
        <div class="exp-role">${role}</div>
        <div class="exp-company">${company}</div>
      </div>
      <div class="exp-meta">${years} - ${city}</div>
    </div>
  `;

      const ul = document.createElement("ul");
      ul.className = "exp-bullets";
      (achievements || "")
        .split(";")
        .map((a) => a.trim())
        .filter(Boolean)
        .forEach((a) => {
          const li = document.createElement("li");
          li.textContent = a;
          ul.appendChild(li);
        });
      if (ul.children.length) item.appendChild(ul);
      wrap.appendChild(item);
    });
  }

  function renderProjects(text) {
    const tgt = qs("p_projects");
    if (!tgt) return;
    const lines = splitLines(text);
    if (!lines.length) {
      tgt.textContent = "—";
      return;
    }
    tgt.innerHTML = (
      <ul style="margin:0 0 0 16px; padding:0;">
        ${lines.map((p) => <li>${p}</li>).join("")}
      </ul>
    );
  }

  function renderCerts(text) {
    const sec = qs("certSection");
    const tgt = qs("p_certs");
    if (!sec || !tgt) return;
    const certs = splitLines(text);
    if (!certs.length) {
      sec.style.display = "none";
      tgt.innerHTML = "";
      return;
    }
    sec.style.display = "block";
    tgt.innerHTML = certs.map((c) => <div>${c}</div>).join("");
  }

  function updatePreview() {
    const name = qs("name")?.value || "Your Name";
    const title = qs("title")?.value || "Target Role";
    const email = qs("email")?.value || "you@example.com";
    const phone = qs("phone")?.value || "+91-XXXXXXXXXX";
    const location = qs("location")?.value || "City, Country";
    const links = qs("links")?.value || "LinkedIn | GitHub | Portfolio";
    const summary =
      qs("summary")?.value || "Concise professional summary goes here.";
    if (qs("p_name")) qs("p_name").textContent = name;
    if (qs("p_title")) qs("p_title").textContent = title;
    if (qs("p_email")) qs("p_email").textContent = email;
    if (qs("p_phone")) qs("p_phone").textContent = phone;
    if (qs("p_location")) qs("p_location").textContent = location;
    if (qs("p_links")) qs("p_links").textContent = links;
    if (qs("p_summary")) qs("p_summary").textContent = summary;

    renderSkills(qs("skills")?.value);
    renderExperience(qs("experience")?.value);
    if (qs("p_education")) {
      const eduLines = splitLines(qs("education")?.value);
      qs("p_education").innerHTML = eduLines.length
        ? eduLines.map((e) => `<div>${e}</div>`).join("")
        : "—";
    }
    renderProjects(qs("projects")?.value);
    renderCerts(qs("certs")?.value);
  }

  // Live listeners
  const bindIds = [
    "name",
    "title",
    "email",
    "phone",
    "location",
    "links",
    "summary",
    "skills",
    "experience",
    "education",
    "projects",
    "certs",
  ];
  bindIds.forEach((id) => {
    const el = qs(id);
    if (el) {
      el.addEventListener("input", () => {
        updatePreview();
        autoSaveDraft();
      });
    }
  });

  // Save/Load
  function getData() {
    return {
      name: qs("name")?.value || "",
      title: qs("title")?.value || "",
      email: qs("email")?.value || "",
      phone: qs("phone")?.value || "",
      location: qs("location")?.value || "",
      links: qs("links")?.value || "",
      summary: qs("summary")?.value || "",
      skills: qs("skills")?.value || "",
      experience: qs("experience")?.value || "",
      education: qs("education")?.value || "",
      projects: qs("projects")?.value || "",
      certs: qs("certs")?.value || "",
      template: qs("templateSelect")?.value || "classic",
    };
  }

  function setData(data) {
    if (!data) return;
    if (qs("name")) qs("name").value = data.name || "";
    if (qs("title")) qs("title").value = data.title || "";
    if (qs("email")) qs("email").value = data.email || "";
    if (qs("phone")) qs("phone").value = data.phone || "";
    if (qs("location")) qs("location").value = data.location || "";
    if (qs("links")) qs("links").value = data.links || "";
    if (qs("summary")) qs("summary").value = data.summary || "";
    if (qs("skills")) qs("skills").value = data.skills || "";
    if (qs("experience")) qs("experience").value = data.experience || "";
    if (qs("education")) qs("education").value = data.education || "";
    if (qs("projects")) qs("projects").value = data.projects || "";
    if (qs("certs")) qs("certs").value = data.certs || "";
    if (qs("templateSelect"))
      qs("templateSelect").value = data.template || "classic";
  }

  function saveResume() {
    localStorage.setItem("careerai_resume_data", JSON.stringify(getData()));
    alert("Saved locally.");
  }
  function loadResume() {
    try {
      const data = JSON.parse(localStorage.getItem("careerai_resume_data"));
      if (!data) return alert("No saved resume found.");
      setData(data);
      updatePreview();
      alert("Loaded.");
    } catch (e) {
      alert("Failed to load.");
    }
  }
  function autoSaveDraft() {
    localStorage.setItem("careerai_resume_draft", JSON.stringify(getData()));
  }
  (function loadDraft() {
    try {
      const data = JSON.parse(localStorage.getItem("careerai_resume_draft"));
      if (data) {
        setData(data);
      }
    } catch {}
  })();

  // Prefill from login user
  (function prefillFromAuth() {
    try {
      const user = JSON.parse(localStorage.getItem("careerai_current_user"));
      if (user) {
        if (qs("name") && !qs("name").value) qs("name").value = user.name || "";
        if (qs("email") && !qs("email").value)
          qs("email").value = user.email || "";
      }
    } catch {}
  })();

  // PDF
  async function downloadPDF() {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      alert("jsPDF not loaded");
      return;
    }
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const source = qs("resumePreview");
    if (!source) return alert("Preview not found.");
    await doc.html(source, {
      x: 24,
      y: 24,
      width: 547,
      windowWidth: 820,
      autoPaging: "text",
      html2canvas: { scale: 1.0, useCORS: true },
    });
    const filename = `Resume_${(qs("name")?.value || "Candidate").replace(
      /\s+/g,
      "_"
    )}.pdf`;
    doc.save(filename);
  }
});
