const STORAGE_KEY = "wealth-wizard-v1";
const LEGACY_STORAGE_KEY = "rishitha-wealth-world-v1";
let idSequence = 0;

const INCOME_CATEGORIES = ["Paycheck", "Freelance", "Gift", "Market change", "Other income"];
const SPEND_CATEGORIES = ["Rent", "Groceries", "Transit", "Eating out", "School", "Fun", "Subscriptions", "Other"];
const ACCOUNT_TYPES = [
  ["cash", "Cash"],
  ["savings", "Savings"],
  ["investment", "Investment"],
  ["credit", "Credit"],
];

const state = load();
const ui = { view: "overview", filter: "all", query: "" };

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
document.body.addEventListener("input", onInput);
document.body.addEventListener("change", onChange);
document.getElementById("composer-close").addEventListener("click", () => dialog.close());
document.getElementById("composer-cancel").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

render();

function load() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        localStorage.setItem(STORAGE_KEY, raw);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }
    if (!raw) return seed();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.accounts)) return seed();
    return parsed;
  } catch {
    return seed();
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function seed() {
  const today = new Date();
  const accounts = [
    { id: uid(), name: "Everyday Checking", type: "cash", opening: 240000 },
    { id: uid(), name: "Rainy Day Savings", type: "savings", opening: 900000 },
    { id: uid(), name: "Brokerage", type: "investment", opening: 1500000 },
    { id: uid(), name: "Student Card", type: "credit", opening: -85000 },
  ];
  const byType = (type) => accounts.find((account) => account.type === type).id;
  const transactions = [];

  for (let ago = 5; ago >= 0; ago -= 1) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - ago, 1);
    const maxDay = ago === 0 ? today.getDate() : 28;
    const add = (day, type, accountId, toAccountId, category, amount, note) => {
      if (day > maxDay) return;
      const date = isoDate(monthDate.getFullYear(), monthDate.getMonth(), day);
      transactions.push(tx(date, type, accountId, toAccountId, category, amount, note));
    };
    const paycheck = ago <= 2 ? 300000 : 280000;
    add(1, "in", byType("cash"), null, "Paycheck", paycheck, "Campus job");
    add(2, "out", byType("cash"), null, "Rent", 120000, "Room");
    add(5, "out", byType("cash"), null, "Groceries", 24000 + ago * 800, "Market run");
    add(7, "out", byType("cash"), null, "Transit", 6400, "Transit pass");
    add(8, "out", byType("cash"), null, "Eating out", 5400, "Lunch with friends");
    add(9, "out", byType("credit"), null, "Fun", 4200, "Night out");
    add(11, "out", byType("cash"), null, "Subscriptions", 1599, "Music and storage");
    add(14, "transfer", byType("cash"), byType("savings"), "Savings", 50000, "Automatic save");
    add(16, "transfer", byType("cash"), byType("investment"), "Investing", 20000, "Index fund");
    add(18, "in", byType("investment"), null, "Market change", 7500 + ago * 400, "Monthly change");
    add(18, "transfer", byType("cash"), byType("credit"), "Card payment", 4200, "Paid the fun spend");
    if (ago >= 3) add(20, "transfer", byType("cash"), byType("credit"), "Card payment", 28000, "Paying down the card");
  }

  return {
    demo: true,
    accounts,
    transactions,
    budgets: [
      { id: uid(), category: "Rent", limit: 120000 },
      { id: uid(), category: "Groceries", limit: 32000 },
      { id: uid(), category: "Eating out", limit: 8000 },
      { id: uid(), category: "Fun", limit: 7000 },
      { id: uid(), category: "Subscriptions", limit: 2000 },
      { id: uid(), category: "Transit", limit: 8000 },
    ],
    goals: [
      { id: uid(), name: "Emergency cushion", target: 1000000, saved: 620000, deadline: futureMonth(8) },
      { id: uid(), name: "New laptop", target: 180000, saved: 95000, deadline: futureMonth(3) },
      { id: uid(), name: "Summer trip", target: 250000, saved: 40000, deadline: futureMonth(9) },
    ],
  };
}

function tx(date, type, accountId, toAccountId, category, amount, note) {
  return { id: uid(), date, type, accountId, toAccountId, category, amount, note };
}

function uid() {
  idSequence += 1;
  return Math.random().toString(36).slice(2, 8) + idSequence.toString(36);
}

function isoDate(year, monthIndex, day) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

function todayISO() {
  const now = new Date();
  return isoDate(now.getFullYear(), now.getMonth(), now.getDate());
}

function monthKey(date = new Date()) {
  return isoDate(date.getFullYear(), date.getMonth(), 1).slice(0, 7);
}

function futureMonth(offset) {
  const date = new Date();
  const normalized = new Date(date.getFullYear(), date.getMonth() + offset, 1);
  return isoDate(normalized.getFullYear(), normalized.getMonth(), 1);
}

function money(cents) {
  const sign = cents < 0 ? "-" : "";
  const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(cents) / 100);
  return sign + formatted;
}

function parseMoney(value, { allowNegative = false } = {}) {
  const cleaned = String(value).replace(/[$,\s]/g, "");
  if (!cleaned) return null;
  const amount = Number(cleaned);
  if (!Number.isFinite(amount)) return null;
  const cents = Math.round(amount * 100);
  if (!allowNegative && cents <= 0) return null;
  if (allowNegative && cents === 0) return 0;
  return cents;
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function accountById(id) {
  return state.accounts.find((account) => account.id === id);
}

function accountName(id) {
  return accountById(id)?.name || "Unknown account";
}

function balanceOf(account, throughMonth) {
  let balance = account.opening;
  for (const item of state.transactions) {
    if (throughMonth && item.date.slice(0, 7) > throughMonth) continue;
    if (item.accountId === account.id) {
      if (item.type === "in") balance += item.amount;
      if (item.type === "out" || item.type === "transfer") balance -= item.amount;
    }
    if (item.type === "transfer" && item.toAccountId === account.id) balance += item.amount;
  }
  return balance;
}

function netWorth(throughMonth) {
  return state.accounts.reduce((sum, account) => sum + balanceOf(account, throughMonth), 0);
}

function monthTotals(key) {
  const totals = { income: 0, spending: 0, saved: 0, invested: 0, market: 0 };
  for (const item of state.transactions) {
    if (item.date.slice(0, 7) !== key) continue;
    if (item.type === "in" && item.category === "Market change") totals.market += item.amount;
    else if (item.type === "in") totals.income += item.amount;
    else if (item.type === "out") totals.spending += item.amount;
    else if (item.type === "transfer") {
      const destination = accountById(item.toAccountId);
      if (destination?.type === "savings") totals.saved += item.amount;
      if (destination?.type === "investment") totals.invested += item.amount;
    }
  }
  return totals;
}

function spentInCategory(category, key) {
  return state.transactions
    .filter((item) => item.type === "out" && item.category === category && item.date.slice(0, 7) === key)
    .reduce((sum, item) => sum + item.amount, 0);
}

function recentMonths(count) {
  const months = [];
  const now = new Date();
  for (let ago = count - 1; ago >= 0; ago -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - ago, 1);
    months.push(monthKey(date));
  }
  return months;
}

function render() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === ui.view);
  });
  document.getElementById("header-stat").textContent = money(netWorth());
  bannerEl.innerHTML = state.demo
    ? '<p class="banner">Sample money is filled in so you can click around. Your first edit removes this note. Nothing leaves this browser.</p>'
    : "";
  viewEl.innerHTML = {
    overview: renderOverview,
    activity: renderActivity,
    accounts: renderAccounts,
    budgets: renderBudgets,
    goals: renderGoals,
  }[ui.view]();
}

function renderOverview() {
  const key = monthKey();
  const totals = monthTotals(key);
  const worth = netWorth();
  const cash = sumType(["cash", "savings"]);
  const invested = sumType(["investment"]);
  const debt = state.accounts.reduce((sum, account) => sum + Math.min(0, balanceOf(account)), 0);
  const kept = totals.income - totals.spending;
  const over = state.budgets.filter((budget) => spentInCategory(budget.category, key) > budget.limit);
  const insight = over.length
    ? `${over[0].category} is over its monthly cap.`
    : totals.income
      ? `You kept ${money(kept)} after spending this month.`
      : "Log a paycheck or an expense to see this month take shape.";

  return `
    <section class="hero">
      <p class="eyebrow">Net worth</p>
      <p class="hero-num ${worth < 0 ? "negative" : ""}">${money(worth)}</p>
      <p class="lede">${esc(insight)} Cash, savings, and investments are counted. Debt is subtracted.</p>
    </section>
    <section class="stats">
      ${statCard("Cash on hand", cash, "Checking and savings")}
      ${statCard("Invested", invested, "Brokerage balance")}
      ${statCard("Owed", debt, "Credit balances")}
    </section>
    <section class="split">
      <article class="panel">
        <header>
          <h3>Six-month net worth</h3>
          <div class="legend"><span><i class="swatch" style="background:#b794f4"></i>Balance</span></div>
        </header>
        ${netWorthChart()}
      </article>
      <article class="panel">
        <h3>Where it sits</h3>
        ${allocationChart(cash, invested, Math.abs(debt))}
      </article>
    </section>
    <section class="split">
      <article class="panel">
        <header>
          <h3>This month</h3>
          <div class="legend">
            <span><i class="swatch" style="background:#9ec5f8"></i>In</span>
            <span><i class="swatch" style="background:#f4a4c4"></i>Out</span>
          </div>
        </header>
        ${cashFlowChart()}
      </article>
      <article class="panel">
        <header class="section-head"><h3>Latest activity</h3></header>
        <div class="list">${transactionRows(sortedTransactions().slice(0, 5))}</div>
      </article>
    </section>
    <div class="tools">
      <button type="button" class="ghost" data-action="reset-demo">Reload sample money</button>
      <button type="button" class="danger" data-action="erase">Erase everything</button>
    </div>
  `;
}

function statCard(label, cents, note) {
  const tone = cents < 0 ? "bad" : "";
  return `<article class="card"><h3>${label}</h3><p class="stat ${tone}">${money(cents)}</p><p class="hint">${note}</p></article>`;
}

function sumType(types) {
  return state.accounts
    .filter((account) => types.includes(account.type))
    .reduce((sum, account) => sum + balanceOf(account), 0);
}

function netWorthChart() {
  const months = recentMonths(6);
  const points = months.map((key) => ({ key, value: netWorth(key) }));
  return lineChart(points);
}

function cashFlowChart() {
  const months = recentMonths(6);
  const rows = months.map((key) => ({ key, ...monthTotals(key) }));
  const max = Math.max(...rows.flatMap((row) => [row.income, row.spending]), 1);
  const width = 520;
  const height = 180;
  const slot = width / rows.length;
  const bars = rows.map((row, index) => {
    const x = index * slot + 18;
    const inH = (row.income / max) * 120;
    const outH = (row.spending / max) * 120;
    const label = row.key.slice(5);
    return `
      <rect x="${x}" y="${140 - inH}" width="14" height="${inH}" rx="4" fill="#9ec5f8"></rect>
      <rect x="${x + 18}" y="${140 - outH}" width="14" height="${outH}" rx="4" fill="#f4a4c4"></rect>
      <text x="${x + 16}" y="166" text-anchor="middle" font-size="12" fill="#7a6d8a">${label}</text>
    `;
  }).join("");
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Income and spending for six months">${bars}</svg>`;
}

function lineChart(points) {
  const width = 520;
  const height = 190;
  const min = Math.min(...points.map((point) => point.value));
  const max = Math.max(...points.map((point) => point.value));
  const span = max - min || 1;
  const coords = points.map((point, index) => {
    const x = 24 + (index * (width - 48)) / Math.max(points.length - 1, 1);
    const y = 20 + (1 - (point.value - min) / span) * 120;
    return [x, y];
  });
  const line = coords.map((pair) => pair.join(",")).join(" ");
  const area = `${coords[0][0]},150 ${line} ${coords[coords.length - 1][0]},150`;
  const labels = points.map((point, index) => `
    <text x="${coords[index][0]}" y="176" text-anchor="middle" font-size="12" fill="#7a6d8a">${point.key.slice(5)}</text>
  `).join("");
  return `
    <svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Net worth over six months">
      <polygon points="${area}" fill="rgba(183,148,244,0.18)"></polygon>
      <polyline points="${line}" fill="none" stroke="#b794f4" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"></polyline>
      ${labels}
    </svg>
  `;
}

function allocationChart(cash, invested, debt) {
  const parts = [
    { label: "Cash", value: Math.max(cash, 0), color: "#b794f4" },
    { label: "Invested", value: Math.max(invested, 0), color: "#f4a4c4" },
    { label: "Debt", value: Math.max(debt, 0), color: "#9ec5f8" },
  ];
  const total = parts.reduce((sum, part) => sum + part.value, 0);
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  const rings = total
    ? parts.filter((part) => part.value > 0).map((part) => {
        const length = (part.value / total) * circ;
        const circle = `<circle cx="70" cy="70" r="${radius}" fill="none" stroke="${part.color}" stroke-width="16" stroke-dasharray="${length} ${circ - length}" stroke-dashoffset="${-offset}" transform="rotate(-90 70 70)"></circle>`;
        offset += length;
        return circle;
      }).join("")
    : `<circle cx="70" cy="70" r="${radius}" fill="none" stroke="#e4d7f2" stroke-width="16"></circle>`;
  const rows = parts.map((part) => `
    <div class="alloc-row"><span><i class="swatch" style="background:${part.color}"></i>${part.label}</span><strong>${money(part.value)}</strong></div>
  `).join("");
  return `
    <div class="donut-wrap">
      <svg viewBox="0 0 140 140" role="img" aria-label="Allocation of cash, investments, and debt">${rings}</svg>
      <div>
        <p class="donut-label">${total ? "Mix" : "No balances yet"}</p>
        ${rows}
      </div>
    </div>
  `;
}

function renderActivity() {
  const items = filteredTransactions();
  return `
    <section class="panel">
      <header class="section-head">
        <h3>${items.length} move${items.length === 1 ? "" : "s"}</h3>
        <input id="search" class="search" type="search" placeholder="Search notes or categories" value="${esc(ui.query)}" />
      </header>
      <div class="filters">
        ${["all", "in", "out", "transfer"].map((filter) => `
          <button type="button" class="chip ${ui.filter === filter ? "active" : ""}" data-filter="${filter}">${filterLabel(filter)}</button>
        `).join("")}
      </div>
      <div class="list" id="activity-list">${items.length ? transactionRows(items) : '<p class="hint">No moves match that filter.</p>'}</div>
    </section>
  `;
}

function filterLabel(filter) {
  return { all: "All", in: "Income", out: "Spending", transfer: "Transfers" }[filter];
}

function filteredTransactions() {
  const query = ui.query.trim().toLowerCase();
  return sortedTransactions().filter((item) => {
    if (ui.filter !== "all" && item.type !== ui.filter) return false;
    if (!query) return true;
    return `${item.category} ${item.note} ${accountName(item.accountId)}`.toLowerCase().includes(query);
  });
}

function sortedTransactions() {
  return [...state.transactions].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

function transactionRows(items) {
  return items.map((item) => {
    const sign = item.type === "out" || item.type === "transfer" ? "-" : "+";
    const tone = item.type === "out" ? "neg" : "pos";
    const detail = item.type === "transfer"
      ? `${accountName(item.accountId)} → ${accountName(item.toAccountId)}`
      : accountName(item.accountId);
    return `
      <div class="row">
        <div>
          <strong>${esc(item.category)}</strong>
          <small>${esc(item.date)} · ${esc(detail)}${item.note ? ` · ${esc(item.note)}` : ""}</small>
        </div>
        <strong class="amount ${tone}">${sign}${money(item.amount)}</strong>
        <button type="button" class="ghost" data-action="delete-tx" data-id="${esc(item.id)}">Remove</button>
      </div>
    `;
  }).join("");
}

function renderAccounts() {
  if (!state.accounts.length) {
    return emptyPanel("No accounts yet", "Add a checking account, a savings pot, or a card you owe.", "Add account", "account");
  }
  const cards = state.accounts.map((account) => {
    const balance = balanceOf(account);
    const label = ACCOUNT_TYPES.find((type) => type[0] === account.type)?.[1] || account.type;
    return `
      <article class="card">
        <div class="account-top">
          <div>
            <span class="pill ${esc(account.type)}">${esc(label)}</span>
            <h3 style="margin-top:10px">${esc(account.name)}</h3>
          </div>
          <p class="stat ${balance < 0 ? "bad" : ""}">${money(balance)}</p>
        </div>
        <p class="hint">Opened at ${money(account.opening)}. Activity updates this balance.</p>
        <button type="button" class="ghost" data-action="delete-account" data-id="${esc(account.id)}">Remove account</button>
      </article>
    `;
  }).join("");
  return `
    <div class="section-head">
      <h2 style="font-family:var(--serif);font-weight:560">Accounts</h2>
      <button type="button" class="primary" data-compose="account">Add account</button>
    </div>
    <div class="cards">${cards}</div>
  `;
}

function renderBudgets() {
  const key = monthKey();
  if (!state.budgets.length) {
    return emptyPanel("No budgets yet", "Set a monthly cap for rent, food, or fun.", "Add budget", "budget");
  }
  const cards = state.budgets.map((budget) => {
    const spent = spentInCategory(budget.category, key);
    const ratio = budget.limit > 0 ? Math.min(spent / budget.limit, 1) : 0;
    const over = spent > budget.limit;
    return `
      <article class="card">
        <div class="account-top">
          <h3>${esc(budget.category)}</h3>
          <strong class="${over ? "amount neg" : ""}">${money(spent)} / ${money(budget.limit)}</strong>
        </div>
        <div class="bar ${over ? "over" : ""}"><span style="width:${ratio * 100}%"></span></div>
        <p class="hint">${over ? `${money(spent - budget.limit)} over the cap` : `${money(budget.limit - spent)} left this month`}</p>
        <button type="button" class="ghost" data-action="delete-budget" data-id="${esc(budget.id)}">Remove</button>
      </article>
    `;
  }).join("");
  return `
    <div class="section-head">
      <h2 style="font-family:var(--serif);font-weight:560">Budgets</h2>
      <button type="button" class="primary" data-compose="budget">Add budget</button>
    </div>
    <div class="cards">${cards}</div>
  `;
}

function renderGoals() {
  if (!state.goals.length) {
    return emptyPanel("No goals yet", "Name something you are saving toward and track the pile.", "Add goal", "goal");
  }
  const cards = state.goals.map((goal) => {
    const ratio = goal.target > 0 ? Math.min(goal.saved / goal.target, 1) : 0;
    const ready = goal.saved >= goal.target;
    return `
      <article class="card">
        <div class="goal-top">
          <h3>${esc(goal.name)}</h3>
          <strong>${money(goal.saved)} / ${money(goal.target)}</strong>
        </div>
        <div class="bar gold"><span style="width:${ratio * 100}%"></span></div>
        <p class="hint">${ready ? "This goal is full." : `${money(goal.target - goal.saved)} to go`}${goal.deadline ? ` · aim for ${esc(goal.deadline)}` : ""}</p>
        <p class="hint">This tracks money you already hold. It does not change net worth.</p>
        <form class="goal-form" data-action="goal-progress" data-id="${esc(goal.id)}">
          <input name="amount" inputmode="decimal" placeholder="Add dollars" aria-label="Dollars to add toward ${esc(goal.name)}" />
          <button class="primary" type="submit">Add</button>
        </form>
        <button type="button" class="ghost" data-action="delete-goal" data-id="${esc(goal.id)}">Remove goal</button>
      </article>
    `;
  }).join("");
  return `
    <div class="section-head">
      <h2 style="font-family:var(--serif);font-weight:560">Goals</h2>
      <button type="button" class="primary" data-compose="goal">Add goal</button>
    </div>
    <div class="goal-grid cards">${cards}</div>
  `;
}

function emptyPanel(title, copy, label, compose) {
  return `
    <section class="panel empty">
      <h2>${title}</h2>
      <p class="lede" style="margin:0 auto 16px">${copy}</p>
      <button type="button" class="primary" data-compose="${compose}">${label}</button>
    </section>
  `;
}

function onClick(event) {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    ui.view = viewButton.dataset.view;
    render();
    return;
  }
  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) {
    ui.filter = filterButton.dataset.filter;
    render();
    return;
  }
  const compose = event.target.closest("[data-compose]");
  if (compose) {
    openComposer(compose.dataset.compose);
    return;
  }
  if (event.target.closest("#add-move")) {
    openComposer("transaction");
    return;
  }
  const action = event.target.closest("[data-action]");
  if (!action) return;
  const id = action.dataset.id;
  if (action.dataset.action === "delete-tx") removeTransaction(id);
  if (action.dataset.action === "delete-account") removeAccount(id);
  if (action.dataset.action === "delete-budget") removeById("budgets", id);
  if (action.dataset.action === "delete-goal") removeById("goals", id);
  if (action.dataset.action === "reset-demo") {
    if (window.confirm("Replace this ledger with the sample money?")) replaceState(seed());
  }
  if (action.dataset.action === "erase") {
    if (window.confirm("Erase every account, move, budget, and goal on this browser?")) {
      replaceState({ demo: false, accounts: [], transactions: [], budgets: [], goals: [] });
    }
  }
}

function onInput(event) {
  if (event.target.id !== "search") return;
  ui.query = event.target.value;
  const list = document.getElementById("activity-list");
  const items = filteredTransactions();
  list.innerHTML = items.length ? transactionRows(items) : '<p class="hint">No moves match that filter.</p>';
}

function onSubmit(event) {
  const form = event.target;
  if (form.id === "composer-form") {
    event.preventDefault();
    saveComposer(form);
    return;
  }
  if (form.dataset.action === "goal-progress") {
    event.preventDefault();
    addGoalProgress(form.dataset.id, form.amount.value);
  }
}

function openComposer(kind) {
  const titles = {
    transaction: "Add a money move",
    account: "Add an account",
    budget: "Add a budget",
    goal: "Add a goal",
  };
  document.getElementById("composer-title").textContent = titles[kind];
  fieldsEl.innerHTML = composerFields(kind);
  errorEl.hidden = true;
  dialog.dataset.kind = kind;
  if (kind === "transaction") syncTransactionFields();
  dialog.showModal();
  fieldsEl.querySelector("input, select")?.focus();
}

function onChange(event) {
  if (event.target.name === "type" && dialog.dataset.kind === "transaction") syncTransactionFields();
}

function syncTransactionFields() {
  const type = dialog.querySelector('[name="type"]')?.value;
  const toField = dialog.querySelector('[name="toAccountId"]')?.closest(".field");
  const categoryField = dialog.querySelector('[name="category"]')?.closest(".field");
  if (toField) toField.hidden = type !== "transfer";
  if (categoryField) categoryField.hidden = type === "transfer";
  const select = dialog.querySelector('[name="category"]');
  if (!select || type === "transfer") return;
  const options = type === "out" ? SPEND_CATEGORIES : INCOME_CATEGORIES;
  const current = select.value;
  select.innerHTML = options.map((category) => `<option value="${esc(category)}">${esc(category)}</option>`).join("");
  if (options.includes(current)) select.value = current;
}

function composerFields(kind) {
  if (kind === "transaction") {
    const accounts = state.accounts.map((account) => `<option value="${esc(account.id)}">${esc(account.name)}</option>`).join("");
    if (!accounts) return `<p class="hint">Add an account before logging money.</p>`;
    return `
      ${selectField("Type", "type", [["in", "Income"], ["out", "Spending"], ["transfer", "Transfer"]])}
      ${field("Amount", '<input name="amount" inputmode="decimal" required placeholder="0.00" />')}
      ${field("Date", `<input name="date" type="date" required value="${todayISO()}" />`)}
      ${field("Account", `<select name="accountId">${accounts}</select>`)}
      ${field("To account", `<select name="toAccountId">${accounts}</select>`)}
      ${selectField("Category", "category", [...INCOME_CATEGORIES, ...SPEND_CATEGORIES].map((category) => [category, category]))}
      ${field("Note", '<input name="note" maxlength="80" placeholder="Optional" />')}
    `;
  }
  if (kind === "account") {
    return `
      ${field("Name", '<input name="name" required maxlength="40" placeholder="Everyday Checking" />')}
      ${selectField("Type", "type", ACCOUNT_TYPES)}
      ${field("Opening balance", '<input name="opening" inputmode="decimal" required placeholder="0.00" />')}
      <p class="hint">Use a minus if this account is money you owe.</p>
    `;
  }
  if (kind === "budget") {
    const used = new Set(state.budgets.map((budget) => budget.category));
    const options = SPEND_CATEGORIES.filter((category) => !used.has(category)).map((category) => [category, category]);
    if (!options.length) return `<p class="hint">Every spending category already has a budget.</p>`;
    return `
      ${selectField("Category", "category", options)}
      ${field("Monthly cap", '<input name="limit" inputmode="decimal" required placeholder="0.00" />')}
    `;
  }
  return `
    ${field("Name", '<input name="name" required maxlength="40" placeholder="Emergency cushion" />')}
    ${field("Target", '<input name="target" inputmode="decimal" required placeholder="0.00" />')}
    ${field("Already saved", '<input name="saved" inputmode="decimal" placeholder="0.00" />')}
    ${field("Aim date", '<input name="deadline" type="date" />')}
  `;
}

function field(label, control) {
  return `<label class="field"><span>${label}</span>${control}</label>`;
}

function selectField(label, name, options) {
  const html = options.map(([value, text]) => `<option value="${esc(value)}">${esc(text)}</option>`).join("");
  return field(label, `<select name="${name}">${html}</select>`);
}

function saveComposer(form) {
  const kind = dialog.dataset.kind;
  const data = new FormData(form);
  const fail = (message) => {
    errorEl.hidden = false;
    errorEl.textContent = message;
  };
  errorEl.hidden = true;

  if (kind === "transaction") {
    if (!state.accounts.length) return fail("Add an account first.");
    const amount = parseMoney(data.get("amount"));
    if (amount == null) return fail("Enter an amount greater than zero.");
    const type = data.get("type");
    const accountId = data.get("accountId");
    const toAccountId = data.get("toAccountId");
    if (type === "transfer" && accountId === toAccountId) return fail("Pick two different accounts.");
    const category = type === "transfer" ? "Transfer" : data.get("category");
    const incomeOk = INCOME_CATEGORIES.includes(category);
    const spendOk = SPEND_CATEGORIES.includes(category);
    if (type === "in" && !incomeOk) return fail("Pick an income category.");
    if (type === "out" && !spendOk) return fail("Pick a spending category.");
    state.transactions.push({
      id: uid(),
      date: data.get("date"),
      type,
      accountId,
      toAccountId: type === "transfer" ? toAccountId : null,
      category,
      amount,
      note: String(data.get("note") || "").trim(),
    });
  } else if (kind === "account") {
    const name = String(data.get("name") || "").trim();
    if (!name) return fail("Name the account.");
    const opening = parseMoney(data.get("opening"), { allowNegative: true });
    if (opening == null) return fail("Enter an opening balance. Zero is allowed.");
    state.accounts.push({ id: uid(), name, type: data.get("type"), opening });
  } else if (kind === "budget") {
    const limit = parseMoney(data.get("limit"));
    if (limit == null) return fail("Enter a monthly cap greater than zero.");
    state.budgets.push({ id: uid(), category: data.get("category"), limit });
  } else if (kind === "goal") {
    const name = String(data.get("name") || "").trim();
    const target = parseMoney(data.get("target"));
    const savedRaw = String(data.get("saved") || "").trim();
    const saved = savedRaw ? parseMoney(savedRaw, { allowNegative: true }) : 0;
    if (!name) return fail("Name the goal.");
    if (target == null) return fail("Enter a target greater than zero.");
    if (saved == null || saved < 0) return fail("Saved amount needs to be zero or more.");
    state.goals.push({
      id: uid(),
      name,
      target,
      saved: Math.min(saved, target),
      deadline: data.get("deadline") || "",
    });
  }
  state.demo = false;
  save();
  dialog.close();
  render();
}

function addGoalProgress(id, raw) {
  const goal = state.goals.find((item) => item.id === id);
  const amount = parseMoney(raw);
  if (!goal || amount == null) return;
  goal.saved = Math.min(goal.target, goal.saved + amount);
  state.demo = false;
  save();
  render();
}

function removeTransaction(id) {
  state.transactions = state.transactions.filter((item) => item.id !== id);
  state.demo = false;
  save();
  render();
}

function removeAccount(id) {
  const used = state.transactions.some((item) => item.accountId === id || item.toAccountId === id);
  if (used) {
    window.alert("Remove the activity on this account first. Balances are calculated from those moves.");
    return;
  }
  state.accounts = state.accounts.filter((account) => account.id !== id);
  state.demo = false;
  save();
  render();
}

function removeById(collection, id) {
  state[collection] = state[collection].filter((item) => item.id !== id);
  state.demo = false;
  save();
  render();
}

function replaceState(next) {
  state.demo = next.demo;
  state.accounts = next.accounts;
  state.transactions = next.transactions;
  state.budgets = next.budgets;
  state.goals = next.goals;
  save();
  render();
}
