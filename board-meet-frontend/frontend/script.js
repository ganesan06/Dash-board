// SVG icons used throughout the application.

const iconPaths = {
  home: `
    <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>
  `,

  whiteboard: `
    <path d="M13 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-8"/>
    <path d="m9 15 1-5 9-9 4 4-9 9z"/>
  `,

  reports: `
    <path d="M5 3h14v18H5z"/>
    <path d="M9 8h6M9 12h6M9 16h3"/>
  `,

  copilot: `
    <path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8z"/>
  `,

  files: `
    <path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  `,

  history: `
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 6v6l4 2"/>
  `,

  board: `
    <rect
      x="2"
      y="4"
      width="20"
      height="14"
      rx="1"
      fill="currentColor"
      opacity=".15"
      stroke="none"
    />
    <path d="M2 4h20v14H2zM8 22l4-4 4 4M14 11l7-8"/>
  `,

  cloud: `
    <path
      d="M5 19a4 4 0 1 1 0-8 7 7 0 0 1 13-3 5.5 5.5 0 1 1 1 11z"
      fill="currentColor"
      stroke="none"
    />
  `,

  arrow: `
    <path d="M4 12h16m-6-6 6 6-6 6"/>
  `,

  search: `
    <circle cx="10" cy="10" r="6"/>
    <path d="m15 15 5 5"/>
  `,

  filter: `
    <path d="M3 4h18l-7 8v7l-4 2v-9z"/>
  `,

  download: `
    <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>
  `
};

function icon(name) {
  return `
    <svg
      class="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      ${iconPaths[name] || iconPaths.reports}
    </svg>
  `;
}

// Escape user input before placing it inside HTML.

function escapeHtml(value) {
  const characters = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };

  return String(value).replace(
    /[&<>"']/g,
    character => characters[character]
  );
}

// Application data.

const navigationItems = [
  { id: "home", label: "Home" },
  { id: "whiteboard", label: "Whiteboard" },
  { id: "reports", label: "Reports" },
  { id: "copilot", label: "AI Copilot" },
  { id: "files", label: "Files" },
  { id: "history", label: "History" }
];

const notes = [
  {
    title: "Team Sync",
    items: [
      "Discuss shift 3",
      "Check pending jobs",
      "Review reports"
    ],
    color: "blue",
    time: "09:15 AM",
    day: "Today",
    important: false
  },

  {
    title: "Action Items",
    items: [
      "Update Excel sheet",
      "Send summary email",
      "Prepare client deck"
    ],
    color: "yellow",
    time: "11:20 AM",
    day: "Today",
    important: false
  },

  {
    title: "Issues",
    items: [
      "Job 4821 delayed",
      "Need vendor confirmation",
      "Follow up tomorrow"
    ],
    color: "green",
    time: "02:45 PM",
    day: "Today",
    important: false
  }
];

const recentFiles = [
  {
    type: "PDF",
    name: "2026-09-16-shift-report.pdf",
    description: "Report · 2 hours ago"
  },

  {
    type: "XLS",
    name: "Jobs.xlsx",
    description: "Excel · 4 hours ago"
  },

  {
    type: "JSON",
    name: "2026-09-17-meeting.json",
    description: "Whiteboard · 6 hours ago"
  }
];

const reportHistory = [
  { name: "Today’s shift 3 report", date: "Just now" },
  { name: "Weekly summary", date: "Yesterday" },
  { name: "Job analysis", date: "Sep 14, 2026" },
  { name: "Meeting summary", date: "Sep 13, 2026" },
  { name: "Monthly report", date: "Sep 10, 2026" }
];

const sourceNames = [
  "Outlook",
  "OneDrive",
  "Whiteboard"
];

const state = {
  selectedDay: "Today",
  importantOnly: false,
  search: "",
  selectedSources: [true, true, true]
};

// Main HTML elements.

const pageContent = document.getElementById("page-content");
const pageTitle = document.getElementById("page-title");
const pageDescription = document.getElementById("page-description");
const headerActions = document.getElementById("header-actions");

const noteDialog = document.getElementById("note-dialog");
const reportDialog = document.getElementById("report-dialog");
const noteForm = document.getElementById("note-form");

let toastTimer;

// Shared helpers.

function navigate(page) {
  if (window.location.hash === `#${page}`) {
    render();
    return;
  }

  window.location.hash = page;
}

function setHeader(title, description, actions = "") {
  pageTitle.textContent = title;
  pageDescription.textContent = description;
  headerActions.innerHTML = actions;
}

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 4000);
}

function renderNavigation(page) {
  document.getElementById("navigation").innerHTML =
    navigationItems.map(item => {
      const active =
        page === item.id ||
        (page === "report" && item.id === "reports");

      return `
        <a
          href="#${item.id}"
          class="nav-link ${active ? "active" : ""}"
          ${active ? 'aria-current="page"' : ""}
          title="${item.label}"
        >
          ${icon(item.id)}
          <span class="nav-label">${item.label}</span>
        </a>
      `;
    }).join("");
}

function fileBadge(type) {
  return `
    <span class="file-badge badge-${type.toLowerCase()}">
      ${type}
    </span>
  `;
}

function renderFileRows() {
  return recentFiles.map((file, index) => `
    <div class="file-row">
      ${fileBadge(file.type)}

      <div class="file-info">
        <strong>${file.name}</strong>
        <small>${file.description}</small>
      </div>

      <button
        class="icon-button"
        onclick="openFile(${index})"
        aria-label="Open ${file.name}"
      >
        ···
      </button>
    </div>
  `).join("");
}

function openFile(index) {
  if (index === 0) {
    reportDialog.showModal();
  } else if (index === 1) {
    showToast("Jobs.xlsx is a sample file in this frontend demo.");
  } else {
    navigate("whiteboard");
  }
}

function composer(placeholder, context) {
  return `
    <form
      class="composer"
      onsubmit="submitMessage(event, '${context}')"
    >
      <span class="sparkle">✦</span>

      <input
        type="text"
        placeholder="${placeholder}"
        aria-label="${placeholder}"
        required
      />

      <button
        type="submit"
        class="button primary send-button"
        aria-label="Send message"
      >
        ${icon("arrow")}
      </button>
    </form>
  `;
}

// Home page.

function renderHome() {
  setHeader(
    "Welcome back, Ganesan 👋",
    "Your AI-powered workspace for notes, reports and productivity"
  );

  const cards = [
    {
      page: "whiteboard",
      icon: "board",
      title: "Whiteboard",
      description: "Capture ideas and meeting notes",
      color: "blue"
    },
    {
      page: "reports",
      icon: "reports",
      title: "Reports",
      description: "Generate AI reports",
      color: "green"
    },
    {
      page: "copilot",
      icon: "copilot",
      title: "AI Copilot",
      description: "Ask questions and get insights",
      color: "purple"
    },
    {
      page: "files",
      icon: "files",
      title: "Files",
      description: "Manage your OneDrive files",
      color: "orange"
    }
  ];

  pageContent.innerHTML = `
    <section class="feature-grid">
      ${cards.map(card => `
        <a
          href="#${card.page}"
          class="feature-card feature-${card.color}"
        >
          <div class="feature-icon">
            ${icon(card.icon)}
          </div>

          <h2>${card.title}</h2>
          <p>${card.description}</p>

          <span class="feature-arrow">
            ${icon("arrow")}
          </span>
        </a>
      `).join("")}
    </section>

    <div class="home-bottom">
      <section class="panel">
        <div class="panel-heading">
          <h2>Recent Items</h2>

          <button
            class="text-button"
            onclick="navigate('files')"
          >
            View all
          </button>
        </div>

        ${renderFileRows()}
      </section>

      <section class="panel">
        <div class="panel-heading">
          <h2>Quick Actions</h2>
        </div>

        <button class="quick-action" onclick="openNoteDialog()">
          ${icon("whiteboard")}
          <span>Create new note</span>
          <span class="chevron">›</span>
        </button>

        <button
          class="quick-action"
          onclick="navigate('reports')"
        >
          ${icon("reports")}
          <span>Generate today’s report</span>
          <span class="chevron">›</span>
        </button>

        <button
          class="quick-action"
          onclick="navigate('copilot')"
        >
          ${icon("copilot")}
          <span>Ask AI about my data</span>
          <span class="chevron">›</span>
        </button>

        <button
          class="quick-action"
          onclick="navigate('files')"
        >
          ${icon("cloud")}
          <span>Open OneDrive</span>
          <span class="chevron">›</span>
        </button>
      </section>
    </div>
  `;
}

// Whiteboard page.

function renderWhiteboard() {
  setHeader(
    "Whiteboard",
    "Capture ideas, plan meetings, and collaborate with AI",
    `
      <button class="button" onclick="selectDay('Today')">
        Today
      </button>

      <button
        class="button primary"
        onclick="openNoteDialog()"
      >
        ＋ New Note
      </button>
    `
  );

  pageContent.innerHTML = `
    <section class="whiteboard">
      <div class="toolbar">
        <button class="button" onclick="navigate('home')">
          ‹ Back
        </button>

        <div class="day-tabs">
          ${["Yesterday", "Today", "Tomorrow"].map(day => `
            <button
              class="day-tab ${
                state.selectedDay === day ? "active" : ""
              }"
              onclick="selectDay('${day}')"
            >
              ${day}
            </button>
          `).join("")}
        </div>

        <button
          class="button"
          onclick="toggleImportantFilter()"
        >
          ${icon("filter")}
          ${state.importantOnly ? "All notes" : "Filter"}
        </button>

        <div class="toolbar-spacer"></div>

        <input
          class="search-input"
          type="search"
          placeholder="Search notes"
          aria-label="Search notes"
          value="${escapeHtml(state.search)}"
          oninput="searchNotes(this.value)"
        />

        <button
          class="button"
          onclick="toggleImportantFilter()"
          aria-pressed="${state.importantOnly}"
        >
          ☆ Important Note
        </button>
      </div>

      <div class="notes-grid" id="notes-grid"></div>

      ${composer(
        "Ask AI anything about your whiteboard...",
        "whiteboard"
      )}
    </section>
  `;

  renderNotes();
}

function renderNotes() {
  const notesGrid = document.getElementById("notes-grid");

  const filteredNotes = notes
    .map((note, index) => ({ ...note, index }))
    .filter(note => {
      const matchesDay = note.day === state.selectedDay;

      const matchesImportance =
        !state.importantOnly || note.important;

      const searchableText =
        `${note.title} ${note.items.join(" ")}`.toLowerCase();

      const matchesSearch = searchableText.includes(
        state.search.toLowerCase()
      );

      return matchesDay && matchesImportance && matchesSearch;
    });

  if (filteredNotes.length === 0) {
    notesGrid.innerHTML = `
      <p class="empty-state">
        No notes found. Create a new note to get started.
      </p>
    `;

    return;
  }

  notesGrid.innerHTML = filteredNotes.map(note => `
    <article class="note note-${note.color}">
      <h3>${escapeHtml(note.title)}</h3>

      <button
        class="icon-button note-star ${
          note.important ? "selected" : ""
        }"
        onclick="toggleNoteImportance(${note.index})"
        aria-label="${
          note.important
            ? "Remove important mark"
            : "Mark note as important"
        }"
        aria-pressed="${note.important}"
      >
        ${note.important ? "★" : "☆"}
      </button>

      <ul>
        ${note.items.map(item => `
          <li>${escapeHtml(item)}</li>
        `).join("")}
      </ul>

      <small>${note.day}, ${note.time}</small>
    </article>
  `).join("");
}

function selectDay(day) {
  state.selectedDay = day;
  renderWhiteboard();
}

function searchNotes(value) {
  state.search = value;
  renderNotes();
}

function toggleImportantFilter() {
  state.importantOnly = !state.importantOnly;
  renderWhiteboard();
}

function toggleNoteImportance(index) {
  notes[index].important = !notes[index].important;
  renderNotes();
}

function openNoteDialog() {
  noteDialog.showModal();
}

document.getElementById("close-note-dialog")
  .addEventListener("click", () => {
    noteDialog.close();
  });

noteForm.addEventListener("submit", event => {
  event.preventDefault();

  const formData = new FormData(noteForm);

  const title = String(formData.get("title")).trim();

  const items = String(formData.get("body"))
    .split("\n")
    .map(item => item.trim())
    .filter(Boolean);

  if (!title || items.length === 0) {
    showToast("Enter a title and at least one note item.");
    return;
  }

  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });

  notes.push({
    title,
    items,
    color: formData.get("color"),
    day: state.selectedDay,
    time,
    important: false
  });

  state.importantOnly = false;
  state.search = "";

  noteForm.reset();
  noteDialog.close();

  navigate("whiteboard");

  showToast("Note created. Notes remain until the page is refreshed.");
});

// Report source selection.

function sourceSymbol(index) {
  if (index === 0) {
    return `
      <span class="source-symbol outlook-symbol">O</span>
    `;
  }

  return `
    <span class="source-symbol">
      ${icon(index === 1 ? "cloud" : "board")}
    </span>
  `;
}

function renderReports() {
  setHeader(
    "Create Report",
    "Select data sources and generate AI-powered reports"
  );

  const descriptions = [
    "Import from your mailbox<br>(search specific emails or folders)",
    "Import files and folders<br>(select specific folders)",
    "Include whiteboard notes"
  ];

  pageContent.innerHTML = `
    <section class="source-panel">
      <h2>Select where I get data from</h2>

      ${sourceNames.map((name, index) => `
        <label class="source-option">
          ${sourceSymbol(index)}

          <span>
            <strong>
              ${name}${index === 0 ? " (Email)" : ""}
            </strong>

            <p>${descriptions[index]}</p>
          </span>

          <input
            type="checkbox"
            aria-label="Use ${name}"
            ${state.selectedSources[index] ? "checked" : ""}
            onchange="updateSource(${index}, this.checked)"
          />
        </label>
      `).join("")}

      <div class="source-footer">
        <button
          id="next-report-button"
          class="button primary"
          onclick="navigate('report')"
          ${state.selectedSources.some(Boolean) ? "" : "disabled"}
        >
          Next
          ${icon("arrow")}
        </button>
      </div>
    </section>
  `;
}

function updateSource(index, checked) {
  state.selectedSources[index] = checked;

  document.getElementById("next-report-button").disabled =
    !state.selectedSources.some(Boolean);
}

// Generated report screen.

function renderReport() {
  setHeader(
    "Create Report",
    "Get insights from your data and generate reports"
  );

  const selectedNames = sourceNames.filter(
    (_, index) => state.selectedSources[index]
  );

  const steps = [
    "Reviewing sample emails...",
    "Reading sample Jobs.xlsx data...",
    "Analyzing whiteboard notes...",
    "Summarizing the shift...",
    "Sample report ready."
  ];

  pageContent.innerHTML = `
    <div class="report-layout">
      <aside class="data-panel">
        <div class="panel-heading">
          <h2>Data Sources</h2>

          <button
            class="text-button"
            onclick="navigate('reports')"
          >
            Edit
          </button>
        </div>

        ${sourceNames.map((name, index) => {
          if (!state.selectedSources[index]) {
            return "";
          }

          return `
            <div class="connection">
              ${sourceSymbol(index)}

              <div>
                <strong>${name}</strong>
                <small>● Demo data</small>
              </div>
            </div>
          `;
        }).join("")}
      </aside>

      <section class="chat-panel">
        <div class="message user-message">
          <div class="message-bubble">
            Create today’s shift 3 report. Show how many jobs
            they completed, individual time taken from
            OneDrive, and give a presentable report.
          </div>

          <span class="avatar">G</span>
        </div>

        <div class="message">
          <span class="sparkle">✦</span>

          <div>
            Here’s a sample shift 3 report using
            ${selectedNames.join(", ") || "sample workspace data"}.

            <ul class="report-steps">
              ${steps.map(step => `
                <li>
                  <span class="step-check">✓</span>
                  ${step}
                </li>
              `).join("")}
            </ul>
          </div>
        </div>

        <div class="report-download">
          ${fileBadge("PDF")}

          <div>
            <strong>Shift 3 Report - 2026-09-16</strong>
            <small>Sample report · Preview</small>
          </div>

          <div class="report-buttons">
            <button
              class="button"
              onclick="openReportPreview()"
            >
              View
            </button>

            <button
              class="button primary"
              onclick="downloadReport()"
            >
              Download
            </button>
          </div>
        </div>

        <div id="conversation-messages"></div>

        ${composer(
          "Ask follow-up questions or request changes...",
          "report"
        )}
      </section>

      <aside class="history-panel">
        <h2>History</h2>
        ${renderHistoryItems()}
      </aside>
    </div>
  `;
}

function openReportPreview() {
  reportDialog.showModal();
}

document.getElementById("close-report-dialog")
  .addEventListener("click", () => {
    reportDialog.close();
  });

function downloadReport() {
  const reportText = [
    "SHIFT 3 REPORT",
    "September 16, 2026",
    "",
    "TEAM SYNC",
    "- Discuss shift 3",
    "- Check pending jobs",
    "- Review reports",
    "",
    "ACTION ITEMS",
    "- Update Excel sheet",
    "- Send summary email",
    "- Prepare client deck",
    "",
    "ISSUES",
    "- Job 4821 delayed",
    "- Need vendor confirmation",
    "- Follow up tomorrow",
    "",
    "This report contains sample frontend data."
  ].join("\n");

  const blob = new Blob([reportText], {
    type: "text/plain;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "shift-3-report-demo.txt";

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);

  showToast("Sample report downloaded as a text file.");
}

// AI Copilot page.

function renderCopilot() {
  setHeader(
    "AI Copilot",
    "Ask questions and get insights from your workspace"
  );

  pageContent.innerHTML = `
    <section class="chat-panel copilot-panel">
      <div class="message">
        <span class="sparkle">✦</span>

        <div>
          How can I help with your workspace?

          <p class="muted">
            Ask about your notes, action items, or shift reports.
          </p>
        </div>
      </div>

      <div id="conversation-messages"></div>

      ${composer("Ask AI about your data...", "copilot")}
    </section>
  `;
}

function submitMessage(event, context) {
  event.preventDefault();

  const input = event.target.querySelector("input");
  const message = input.value.trim();

  if (!message) {
    return;
  }

  input.value = "";

  if (context === "whiteboard") {
    const visibleNotes = notes.filter(
      note => note.day === state.selectedDay
    );

    const totalItems = visibleNotes.reduce(
      (total, note) => total + note.items.length,
      0
    );

    showToast(
      `Demo summary: ${visibleNotes.length} notes with ` +
      `${totalItems} items for ${state.selectedDay.toLowerCase()}.`
    );

    return;
  }

  const conversation = document.getElementById(
    "conversation-messages"
  );

  conversation.insertAdjacentHTML("beforeend", `
    <div class="message user-message">
      <div class="message-bubble">
        ${escapeHtml(message)}
      </div>

      <span class="avatar">G</span>
    </div>

    <div class="message">
      <span class="sparkle">✦</span>

      <div>
        This is a frontend demo. Connect an AI backend
        to generate answers using your workspace data.
      </div>
    </div>
  `);
}

// Files page.

function renderFiles() {
  setHeader(
    "Files",
    "Manage your OneDrive files"
  );

  pageContent.innerHTML = `
    <section class="panel">
      <div class="panel-heading">
        <h2>Your files</h2>
        <span class="muted">Sample files</span>
      </div>

      ${renderFileRows()}
    </section>
  `;
}

// History page.

function renderHistoryItems() {
  return reportHistory.map(item => `
    <button
      class="history-item"
      onclick="openReportPreview()"
    >
      ${icon("reports")}

      <span>
        <strong>${item.name}</strong>
        <small>${item.date}</small>
      </span>
    </button>
  `).join("");
}

function renderHistory() {
  setHeader(
    "History",
    "Your recent reports and workspace activity"
  );

  pageContent.innerHTML = `
    <section class="panel">
      ${renderHistoryItems()}
    </section>
  `;
}

// Page routing.

function render() {
  const requestedPage = window.location.hash.slice(1) || "home";

  const pages = {
    home: renderHome,
    whiteboard: renderWhiteboard,
    reports: renderReports,
    report: renderReport,
    copilot: renderCopilot,
    files: renderFiles,
    history: renderHistory
  };

  const page = Object.prototype.hasOwnProperty.call(
    pages,
    requestedPage
  )
    ? requestedPage
    : "home";

  renderNavigation(page);
  pages[page]();
}

window.addEventListener("hashchange", render);

render();