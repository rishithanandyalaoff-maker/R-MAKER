const STORAGE_KEY = "wealth-wizard-v2";
const LEGACY_KEYS = ["wealth-wizard-v1", "rishitha-wealth-world-v1"];

const STEPS = [
  {
    id: "stage",
    title: "Where are you right now?",
    hint: "We'll tailor the structure to your stage.",
    field: "stage",
    options: [
      { value: "student", label: "Student", note: "Still in school, maybe internships" },
      { value: "offer", label: "Have a job offer", note: "Starting soon, planning ahead" },
      { value: "working", label: "Working full-time", note: "Paychecks are already landing" },
    ],
  },
  {
    id: "international",
    title: "Are you an international student or worker?",
    hint: "Visa and stay plans change what should stay flexible.",
    field: "international",
    options: [
      { value: "yes", label: "Yes", note: "F-1, OPT, H-1B, or similar" },
      { value: "no", label: "No", note: "US citizen or permanent resident" },
    ],
  },
  {
    id: "stay",
    title: "Do you plan to stay in the US long term?",
    hint: "If you might leave within ~5 years, we keep more money flexible.",
    field: "stay",
    options: [
      { value: "yes", label: "Yes", note: "Building a long US career" },
      { value: "maybe", label: "Maybe", note: "Open either way" },
      { value: "no", label: "No / unsure", note: "Likely leave within a few years" },
    ],
  },
  {
    id: "income",
    title: "Do you have (or will you soon have) US earned income?",
    hint: "Needed for IRA contributions. Internship or signing bonus counts.",
    field: "income",
    options: [
      { value: "yes", label: "Yes", note: "Job, internship, or signing bonus" },
      { value: "soon", label: "Soon", note: "Offer in hand, start date coming" },
      { value: "no", label: "Not yet", note: "No US paycheck yet" },
    ],
  },
  {
    id: "debt",
    title: "What debt are you carrying?",
    hint: "High-interest debt jumps near the top of the order.",
    field: "debt",
    options: [
      { value: "none", label: "None that matters", note: "Or only low-rate debt" },
      { value: "student", label: "Student loans", note: "School loans, any country" },
      { value: "high", label: "High-interest debt", note: "Roughly 7–8%+ (cards, etc.)" },
      { value: "both", label: "Student + high-interest", note: "Both in the mix" },
    ],
  },
  {
    id: "emergency",
    title: "Emergency fund status?",
    hint: "On a visa, aim for closer to 6 months of expenses.",
    field: "emergency",
    options: [
      { value: "none", label: "Basically none", note: "Starting from scratch" },
      { value: "partial", label: "Partial cushion", note: "Some cash, not 3–6 months" },
      { value: "ready", label: "3–6 months ready", note: "Comfortable cash buffer" },
    ],
  },
  {
    id: "employer",
    title: "Does your employer offer retirement money?",
    hint: "Match or automatic contribution — free money first.",
    field: "employer",
    options: [
      { value: "match", label: "Yes — match", note: "I must contribute to get it" },
      { value: "auto", label: "Yes — automatic", note: "They contribute even if I don't" },
      { value: "unsure", label: "Not sure yet", note: "Will check with HR" },
      { value: "none", label: "No / not applicable", note: "Student or no plan" },
    ],
  },
  {
    id: "goal",
    title: "Optional: what's the big goal?",
    hint: "You can skip numbers and still get a structure.",
    field: "goal",
    type: "form",
  },
];

const MOVE_TYPES = [
  { value: "job_offer", label: "Got a job offer", effects: { stage: "offer", income: "soon" } },
  { value: "job_start", label: "Started the job", effects: { stage: "working", income: "yes" } },
  { value: "raise_bonus", label: "Raise or big bonus", effects: {} },
  { value: "visa_change", label: "Visa / status change", effects: { international: "yes" } },
  { value: "opened_roth", label: "Opened / funded Roth IRA", effects: { flags: { roth: true } } },
  { value: "opened_401k", label: "Set up 401(k) / got the match", effects: { flags: { k401: true } } },
  { value: "opened_brokerage", label: "Opened a brokerage", effects: { flags: { brokerage: true } } },
  { value: "emergency_hit", label: "Hit emergency-fund target", effects: { emergency: "ready", flags: { emergency: true } } },
  { value: "paid_debt", label: "Cleared high-interest debt", effects: { debt: "none", flags: { highDebt: false } } },
  { value: "refi_loan", label: "Refinanced student loans", effects: { flags: { refi: true } } },
  { value: "move_city", label: "Moved cities / new cost of living", effects: {} },
  { value: "stay_update", label: "Changed US stay plans", effects: {} },
  { value: "other", label: "Other big money move", effects: {} },
];

const state = load();
const ui = { view: state.profile ? "plan" : "home", quizStep: 0, draft: { ...(state.profile || {}) } };

const viewEl = document.getElementById("view");
const bannerEl = document.getElementById("banner");
const dialog = document.getElementById("composer");
const fieldsEl = document.getElementById("composer-fields");
const errorEl = document.getElementById("composer-error");

document.getElementById("today-label").textContent = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

document.body.addEventListener("click", onClick);
document.body.addEventListener("submit", onSubmit);
document.body.addEventListener("change", onChange);
document.getElementById("composer-close").addEventListener("click", () => dialog.close());
document.getElementById("composer-cancel").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

render();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          profile: parsed.profile || null,
          moves: Array.isArray(parsed.moves) ? parsed.moves : [],
          flags: parsed.flags || {},
        };
      }
    }
    for (const key of LEGACY_KEYS) {
      if (localStorage.getItem(key)) localStorage.removeItem(key);
    }
  } catch {
    /* ignore */
  }
  return { profile: null, moves: [], flags: {} };
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function todayISO() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function money(n) {
  if (n == null || n === "" || Number.isNaN(Number(n))) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));
}

function shortHorizon(profile = state.profile) {
  if (!profile) return false;
  return profile.stay === "no" || profile.stay === "maybe";
}

function buildPlan(profile = state.profile, flags = state.flags) {
  if (!profile) return null;
  const short = shortHorizon(profile);
  const international = profile.international === "yes";
  const student = profile.stage === "student";
  const hasIncome = profile.income === "yes" || profile.income === "soon";
  const steps = [];

  const pathTitle = student
    ? "Student starter path"
    : short
      ? "Flexible / shorter US horizon"
      : "Long-horizon growth path";

  const pathBlurb = student
    ? "Learn the accounts, protect cash for school life, and only lock money away when you have US earned income and a longer stay plan."
    : short
      ? "Protect first, take free employer money, then keep most investing in flexible accounts so leaving the US does not strand you."
      : "Protect first (match, high-interest debt, emergency fund), then grow through Roth IRA, 401(k), and brokerage.";

  if (profile.employer === "match" || profile.employer === "unsure") {
    steps.push({
      id: "employer",
      title: "Capture employer retirement money",
      detail: profile.employer === "unsure"
        ? "Ask HR whether the contribution is automatic or a match. If it is a match, contribute at least enough to get the full amount."
        : "Contribute at least enough to get the full match. This is usually the highest-return first dollar.",
      done: Boolean(flags.k401),
      priority: "now",
    });
  } else if (profile.employer === "auto") {
    steps.push({
      id: "employer",
      title: "Confirm automatic employer contribution",
      detail: "If they contribute even when you put in $0, confirm the rate and vesting. Still decide your own 401(k) election next.",
      done: Boolean(flags.k401),
      priority: "now",
    });
  }

  if (profile.debt === "high" || profile.debt === "both") {
    steps.push({
      id: "high_debt",
      title: "Attack high-interest debt",
      detail: "Rates roughly above 7–8% usually beat investing. Knock these down before heavy brokerage funding.",
      done: flags.highDebt === false,
      priority: "now",
    });
  }

  if (profile.emergency !== "ready") {
    steps.push({
      id: "emergency",
      title: international ? "Build a 6-month emergency fund" : "Build a 3–6 month emergency fund",
      detail: "Keep this in high-yield savings. Short-term cash for school, moves, or a wedding can double as the cushion until salary fills it.",
      done: Boolean(flags.emergency) || profile.emergency === "ready",
      priority: "now",
    });
  }

  if (profile.debt === "student" || profile.debt === "both") {
    steps.push({
      id: "student_loans",
      title: "Set a student-loan game plan",
      detail: flags.refi
        ? "You refinanced — keep the new payment on schedule unless the rate is still punishing."
        : "List balances and rates. After a stable job (and H-1B if relevant), compare refinancing. High rates → pay faster; low rates → invest more.",
      done: Boolean(flags.refi),
      priority: "next",
    });
  }

  if (hasIncome && !student) {
    steps.push({
      id: "roth",
      title: short ? "Use Roth IRA carefully (flexible contributions)" : "Fund Roth IRA ($7,500/yr room)",
      detail: short
        ? "Roth contributions can be withdrawn anytime, which helps if you leave. Still prioritize cash flexibility in brokerage for money you may need before 59½."
        : "Unused yearly room is lost. Backdoor Roth once income is high. Keep traditional IRA balance at $0 for clean conversions.",
      done: Boolean(flags.roth),
      priority: short ? "next" : "now",
    });
    steps.push({
      id: "401k",
      title: short ? "401(k): take free money, don't over-lock" : "Max or raise 401(k) toward the annual limit",
      detail: short
        ? "Get the match/auto contribution. Beyond that, prefer brokerage for money you might need if you leave the US."
        : "After the match and Roth IRA, push toward the employee limit. Consider Roth 401(k) in a low-tax partial first year, then traditional when brackets are high.",
      done: Boolean(flags.k401),
      priority: short ? "later" : "next",
    });
  } else if (student && hasIncome) {
    steps.push({
      id: "roth",
      title: "If you have US earned income, use Roth IRA room",
      detail: "Internship or signing-bonus income can open this door. Contributions can come out later; earnings are stricter.",
      done: Boolean(flags.roth),
      priority: "next",
    });
  }

  steps.push({
    id: "brokerage",
    title: short || student ? "Build a flexible brokerage pot" : "Send leftover investing to brokerage",
    detail: short || student
      ? "This is the flexible bucket for goals before retirement age and for internationals who may leave. Broad ETFs beat stock-picking for most of it."
      : "After protecting and filling tax-advantaged room, brokerage holds everything else you might need before 59½.",
    done: Boolean(flags.brokerage),
    priority: short || student ? "now" : "later",
  });

  steps.push({
    id: "allocation",
    title: "Keep investing simple",
    detail: "Long-term money: broad US + international funds (for example ~70–80% US, ~20–30% international). Individual stocks: small slice only, and check employer trading rules.",
    done: false,
    priority: "later",
  });

  const focus = steps.filter((step) => !step.done && step.priority === "now");
  const next = steps.filter((step) => !step.done && step.priority === "next");

  return {
    pathTitle,
    pathBlurb,
    short,
    international,
    student,
    steps,
    focus: focus.length ? focus : next.slice(0, 2),
    goalLine: goalSentence(profile),
  };
}

function goalSentence(profile) {
  if (!profile) return "";
  const amount = profile.goalAmount ? money(profile.goalAmount) : null;
  const age = profile.goalAge || null;
  if (amount && age) return `${amount} net worth by age ${age}`;
  if (amount) return `${amount} net worth goal`;
  if (age) return `Freedom-style goal by age ${age}`;
  return "No dollar goal yet — structure still works";
}

function render() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === ui.view);
  });

  const cta = document.getElementById("primary-cta");
  const top = document.getElementById("top-line");
  if (!state.profile) {
    cta.textContent = "Get started";
    cta.dataset.action = "go-quiz";
    top.textContent = "A few questions. A clear structure. Update with big moves.";
  } else if (ui.view === "moves") {
    cta.textContent = "Log a big move";
    cta.dataset.action = "log-move";
    top.textContent = `${state.moves.length} big move${state.moves.length === 1 ? "" : "s"} logged`;
  } else {
    cta.textContent = "Log a big move";
    cta.dataset.action = "log-move";
    top.innerHTML = `Plan ready · <strong>${esc(goalSentence(state.profile))}</strong>`;
  }

  bannerEl.innerHTML = "";
  viewEl.innerHTML = {
    home: renderHome,
    quiz: renderQuiz,
    plan: renderPlan,
    moves: renderMoves,
  }[ui.view]();
}

function renderHome() {
  return `
    <section class="hero">
      <p class="eyebrow">For students & internationals</p>
      <p class="hero-num" style="font-size:clamp(2.2rem,4vw,3.4rem)">Start with a structure. Update when life jumps.</p>
      <p class="lede">Wealth Wizard asks a short set of questions, recommends the order to fund accounts, then grows with you when big moves happen — job offers, visas, emergency fund done, refinance — not daily expenses.</p>
      <div class="tools" style="margin-top:18px">
        <button type="button" class="primary" data-action="go-quiz">${state.profile ? "Retake setup" : "Build my structure"}</button>
        ${state.profile ? '<button type="button" class="ghost" data-view="plan">Open my structure</button>' : ""}
      </div>
    </section>
    <section class="stats">
      <article class="card"><h3>1. Setup</h3><p class="hint">Stage, visa, debt, emergency fund, employer money.</p></article>
      <article class="card"><h3>2. Structure</h3><p class="hint">A clear funding order: protect first, then grow.</p></article>
      <article class="card"><h3>3. Big moves</h3><p class="hint">Log raises, accounts opened, visa changes — the plan updates.</p></article>
    </section>
    <section class="panel">
      <h3>Who this is for</h3>
      <p class="lede">International grads learning US accounts. Students with internships. Anyone who will not track every latte, but wants a plan that stays current when life jumps.</p>
      <p class="hint" style="margin-top:12px">Not tax, legal, or investment advice. Confirm visa and tax items with your school’s international office, HR, and a professional.</p>
    </section>
  `;
}

function renderQuiz() {
  const step = STEPS[ui.quizStep];
  const progress = Math.round(((ui.quizStep + 1) / STEPS.length) * 100);
  let body = "";

  if (step.type === "form") {
    body = `
      <div class="composer-fields" style="padding:0">
        <label class="field"><span>Goal net worth (optional)</span>
          <input name="goalAmount" inputmode="decimal" placeholder="1000000" value="${esc(ui.draft.goalAmount || "")}" data-draft="goalAmount" />
        </label>
        <label class="field"><span>Goal age (optional)</span>
          <input name="goalAge" inputmode="numeric" placeholder="35" value="${esc(ui.draft.goalAge || "")}" data-draft="goalAge" />
        </label>
        <label class="field"><span>Rough monthly living cost (optional)</span>
          <input name="living" inputmode="decimal" placeholder="3000" value="${esc(ui.draft.living || "")}" data-draft="living" />
        </label>
      </div>
      <p class="hint">Financial independence ballpark is often ~25× yearly spending. At $3,000/mo, that’s about $900k.</p>
    `;
  } else {
    body = `
      <div class="choice-grid">
        ${step.options.map((option) => `
          <button type="button" class="choice ${ui.draft[step.field] === option.value ? "active" : ""}" data-choice="${option.value}" data-field="${step.field}">
            <strong>${esc(option.label)}</strong>
            <span>${esc(option.note)}</span>
          </button>
        `).join("")}
      </div>
    `;
  }

  return `
    <section class="panel quiz-panel">
      <div class="quiz-progress" aria-hidden="true"><span style="width:${progress}%"></span></div>
      <p class="eyebrow">Question ${ui.quizStep + 1} of ${STEPS.length}</p>
      <h2 class="quiz-title">${esc(step.title)}</h2>
      <p class="lede">${esc(step.hint)}</p>
      ${body}
      <div class="tools">
        ${ui.quizStep > 0 ? '<button type="button" class="ghost" data-action="quiz-back">Back</button>' : ""}
        <button type="button" class="primary" data-action="quiz-next">${ui.quizStep === STEPS.length - 1 ? "See my structure" : "Continue"}</button>
      </div>
      <p id="quiz-error" class="form-error" hidden style="margin:12px 0 0"></p>
    </section>
  `;
}

function renderPlan() {
  if (!state.profile) {
    return `
      <section class="panel empty">
        <h2>No structure yet</h2>
        <p class="lede" style="margin:0 auto 16px">Answer a few setup questions and we’ll recommend the order to fund things.</p>
        <button type="button" class="primary" data-action="go-quiz">Start setup</button>
      </section>
    `;
  }

  const plan = buildPlan();
  const doneCount = plan.steps.filter((step) => step.done).length;

  return `
    <section class="hero">
      <p class="eyebrow">${esc(plan.pathTitle)}</p>
      <p class="hero-num" style="font-size:clamp(2rem,4vw,3rem)">${esc(plan.goalLine)}</p>
      <p class="lede">${esc(plan.pathBlurb)}</p>
      <p class="hint" style="margin-top:10px">${doneCount}/${plan.steps.length} structure steps marked done via big moves · ${plan.short ? "Flexible horizon" : "Long horizon"}${plan.international ? " · International-aware" : ""}</p>
    </section>

    <section class="split">
      <article class="panel">
        <header class="section-head"><h3>Do these next</h3></header>
        <div class="list">
          ${plan.focus.map((step) => `
            <div class="row plan-row">
              <div>
                <strong>${esc(step.title)}</strong>
                <small>${esc(step.detail)}</small>
              </div>
              <span class="pill cash">Focus</span>
            </div>
          `).join("") || '<p class="hint">Nice — focus items are clear. Keep logging big moves as life changes.</p>'}
        </div>
      </article>
      <article class="panel">
        <header class="section-head"><h3>Snapshot</h3></header>
        <div class="alloc-row"><span>Stage</span><strong>${esc(labelFor("stage", state.profile.stage))}</strong></div>
        <div class="alloc-row"><span>Stay in US</span><strong>${esc(labelFor("stay", state.profile.stay))}</strong></div>
        <div class="alloc-row"><span>Emergency fund</span><strong>${esc(labelFor("emergency", state.profile.emergency))}</strong></div>
        <div class="alloc-row"><span>Debt</span><strong>${esc(labelFor("debt", state.profile.debt))}</strong></div>
        <div class="alloc-row"><span>Employer money</span><strong>${esc(labelFor("employer", state.profile.employer))}</strong></div>
        <div class="tools">
          <button type="button" class="ghost" data-action="log-move">Log a big move</button>
          <button type="button" class="ghost" data-action="go-quiz">Edit setup</button>
        </div>
      </article>
    </section>

    <section class="panel">
      <header class="section-head"><h3>Your funding order</h3></header>
      <div class="list">
        ${plan.steps.map((step, index) => `
          <div class="row plan-row">
            <div>
              <strong>${index + 1}. ${esc(step.title)}</strong>
              <small>${esc(step.detail)}</small>
            </div>
            <span class="pill ${step.done ? "savings" : step.priority === "now" ? "cash" : "investment"}">${step.done ? "Done" : step.priority}</span>
          </div>
        `).join("")}
      </div>
    </section>

    <p class="hint">Protect first, then grow. Review when something big changes — not every day.</p>
  `;
}

function labelFor(field, value) {
  const step = STEPS.find((item) => item.field === field);
  return step?.options?.find((option) => option.value === value)?.label || value || "—";
}

function renderMoves() {
  if (!state.profile) {
    return `
      <section class="panel empty">
        <h2>Setup first</h2>
        <p class="lede" style="margin:0 auto 16px">Build your structure, then log big moves to keep it current.</p>
        <button type="button" class="primary" data-action="go-quiz">Start setup</button>
      </section>
    `;
  }

  const rows = [...state.moves].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  return `
    <section class="panel">
      <header class="section-head">
        <div>
          <h3>Big moves</h3>
          <p class="hint">Job starts, visas, accounts opened, emergency fund hit, refinance — milestones that should change your plan.</p>
        </div>
        <button type="button" class="primary" data-action="log-move">Log a big move</button>
      </header>
      <div class="list">
        ${rows.length ? rows.map((move) => `
          <div class="row">
            <div>
              <strong>${esc(moveLabel(move.type))}</strong>
              <small>${esc(move.date)}${move.note ? ` · ${esc(move.note)}` : ""}</small>
            </div>
            <button type="button" class="ghost" data-action="delete-move" data-id="${esc(move.id)}">Remove</button>
          </div>
        `).join("") : '<p class="hint">No big moves yet. When something major happens, log it here and your structure updates.</p>'}
      </div>
    </section>
  `;
}

function moveLabel(type) {
  return MOVE_TYPES.find((item) => item.value === type)?.label || type;
}

function onClick(event) {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    ui.view = viewButton.dataset.view;
    if (ui.view === "quiz") ui.quizStep = 0;
    render();
    return;
  }

  const action = event.target.closest("[data-action]");
  if (action) {
    const name = action.dataset.action;
    if (name === "go-quiz") {
      ui.view = "quiz";
      ui.quizStep = 0;
      ui.draft = { ...(state.profile || {}) };
      render();
      return;
    }
    if (name === "quiz-back") {
      ui.quizStep = Math.max(0, ui.quizStep - 1);
      render();
      return;
    }
    if (name === "quiz-next") {
      advanceQuiz();
      return;
    }
    if (name === "log-move") {
      openMoveComposer();
      return;
    }
    if (name === "delete-move") {
      deleteMove(action.dataset.id);
      return;
    }
  }

  const choice = event.target.closest("[data-choice]");
  if (choice) {
    ui.draft[choice.dataset.field] = choice.dataset.choice;
    render();
  }
}

function onChange(event) {
  const draft = event.target.closest("[data-draft]");
  if (!draft) return;
  ui.draft[draft.dataset.draft] = draft.value;
}

function onSubmit(event) {
  if (event.target.id !== "composer-form") return;
  event.preventDefault();
  saveMove(event.target);
}

function advanceQuiz() {
  const step = STEPS[ui.quizStep];
  const error = document.getElementById("quiz-error");
  if (step.type !== "form" && !ui.draft[step.field]) {
    error.hidden = false;
    error.textContent = "Pick one to continue.";
    return;
  }
  if (ui.quizStep < STEPS.length - 1) {
    ui.quizStep += 1;
    render();
    return;
  }

  state.profile = {
    stage: ui.draft.stage,
    international: ui.draft.international,
    stay: ui.draft.stay,
    income: ui.draft.income,
    debt: ui.draft.debt,
    emergency: ui.draft.emergency,
    employer: ui.draft.employer,
    goalAmount: ui.draft.goalAmount ? Number(String(ui.draft.goalAmount).replace(/[$,\s]/g, "")) : null,
    goalAge: ui.draft.goalAge ? Number(ui.draft.goalAge) : null,
    living: ui.draft.living ? Number(String(ui.draft.living).replace(/[$,\s]/g, "")) : null,
    updatedAt: todayISO(),
  };
  if (state.profile.debt === "high" || state.profile.debt === "both") state.flags.highDebt = true;
  if (state.profile.emergency === "ready") state.flags.emergency = true;
  save();
  ui.view = "plan";
  render();
}

function openMoveComposer() {
  if (!state.profile) {
    ui.view = "quiz";
    render();
    return;
  }
  errorEl.hidden = true;
  fieldsEl.innerHTML = `
    <label class="field"><span>What happened?</span>
      <select name="type" required>
        ${MOVE_TYPES.map((type) => `<option value="${type.value}">${esc(type.label)}</option>`).join("")}
      </select>
    </label>
    <label class="field"><span>Date</span>
      <input name="date" type="date" required value="${todayISO()}" />
    </label>
    <label class="field"><span>Stay plans (only for stay update)</span>
      <select name="stay">
        <option value="">No change</option>
        <option value="yes">Staying long term</option>
        <option value="maybe">Maybe</option>
        <option value="no">Leaving / short horizon</option>
      </select>
    </label>
    <label class="field"><span>Note (optional)</span>
      <input name="note" maxlength="120" placeholder="e.g. H-1B approved, opened Fidelity Roth" />
    </label>
  `;
  dialog.showModal();
  fieldsEl.querySelector("select")?.focus();
}

function saveMove(form) {
  const data = new FormData(form);
  const type = data.get("type");
  const meta = MOVE_TYPES.find((item) => item.value === type);
  if (!meta) {
    errorEl.hidden = false;
    errorEl.textContent = "Pick a move type.";
    return;
  }

  state.moves.push({
    id: uid(),
    type,
    date: data.get("date") || todayISO(),
    note: String(data.get("note") || "").trim(),
  });

  const effects = meta.effects || {};
  Object.entries(effects).forEach(([key, value]) => {
    if (key === "flags" && value && typeof value === "object") {
      state.flags = { ...state.flags, ...value };
    } else if (state.profile && key in state.profile) {
      state.profile[key] = value;
    }
  });

  const stay = data.get("stay");
  if (type === "stay_update" && stay) state.profile.stay = stay;
  if (type === "paid_debt") state.profile.debt = state.profile.debt === "both" ? "student" : "none";
  if (type === "emergency_hit") state.profile.emergency = "ready";

  state.profile.updatedAt = todayISO();
  save();
  dialog.close();
  ui.view = "plan";
  render();
}

function deleteMove(id) {
  state.moves = state.moves.filter((move) => move.id !== id);
  rebuildFlagsFromMoves();
  save();
  render();
}

function rebuildFlagsFromMoves() {
  const flags = {};
  if (state.profile?.debt === "high" || state.profile?.debt === "both") flags.highDebt = true;
  if (state.profile?.emergency === "ready") flags.emergency = true;
  for (const move of state.moves) {
    const effects = MOVE_TYPES.find((item) => item.value === move.type)?.effects || {};
    if (effects.flags) Object.assign(flags, effects.flags);
    if (effects.stage) state.profile.stage = effects.stage;
    if (effects.income) state.profile.income = effects.income;
    if (effects.emergency) state.profile.emergency = effects.emergency;
    if (effects.debt) state.profile.debt = effects.debt;
    if (effects.international) state.profile.international = effects.international;
  }
  state.flags = flags;
}
