/* ─────────────────────────────────────────────
   Bucks2Bar — script.js
   Stack: Bootstrap 5 + Chart.js 4 | Currency: INR
───────────────────────────────────────────── */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ── INR formatter ───────────────────────────
const inrFmt = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

// ── Build table rows ─────────────────────────
function buildTable() {
  const tbody = document.getElementById('budgetBody');
  tbody.innerHTML = '';

  MONTHS.forEach((month, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="fw-semibold">${month}</td>
      <td>
        <div class="input-group input-group-sm">
          <span class="input-group-text">&#8377;</span>
          <input
            type="number"
            class="form-control income-input"
            id="income-${i}"
            placeholder="0"
            min="0"
            step="1"
            aria-label="${month} income"
          />
        </div>
      </td>
      <td>
        <div class="input-group input-group-sm">
          <span class="input-group-text">&#8377;</span>
          <input
            type="number"
            class="form-control expense-input"
            id="expense-${i}"
            placeholder="0"
            min="0"
            step="1"
            aria-label="${month} expense"
          />
        </div>
      </td>
      <td id="net-${i}" class="net-zero">&#8377; 0</td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Read a numeric input value (0 if empty) ──
function val(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

// ── Update Net cell for one month ───────────
function updateRow(i) {
  const income  = val(`income-${i}`);
  const expense = val(`expense-${i}`);
  const net     = income - expense;
  const cell    = document.getElementById(`net-${i}`);

  cell.textContent = inrFmt.format(net);
  cell.className   = net > 0 ? 'net-positive'
                   : net < 0 ? 'net-negative'
                   : 'net-zero';
}

// ── Update footer totals row ─────────────────
function updateTotals() {
  let totalIncome = 0, totalExpense = 0;

  MONTHS.forEach((_, i) => {
    totalIncome  += val(`income-${i}`);
    totalExpense += val(`expense-${i}`);
  });

  const totalNet = totalIncome - totalExpense;

  document.getElementById('totalIncome').textContent  = inrFmt.format(totalIncome);
  document.getElementById('totalExpense').textContent = inrFmt.format(totalExpense);

  const netCell = document.getElementById('totalNet');
  netCell.textContent = inrFmt.format(totalNet);
  netCell.className   = totalNet > 0 ? 'net-positive'
                      : totalNet < 0 ? 'net-negative'
                      : 'net-zero';
}

// ── Get all 12 months data ───────────────────
function getMonthData() {
  return MONTHS.map((_, i) => ({
    income:  val(`income-${i}`),
    expense: val(`expense-${i}`)
  }));
}

// ── Chart.js instance ────────────────────────
let budgetChart = null;

function renderChart() {
  const data = getMonthData();

  const incomeData  = data.map(d => d.income);
  const expenseData = data.map(d => d.expense);

  if (budgetChart) {
    // Update existing chart in-place
    budgetChart.data.datasets[0].data = incomeData;
    budgetChart.data.datasets[1].data = expenseData;
    budgetChart.update();
    return;
  }

  const ctx = document.getElementById('budgetChart').getContext('2d');

  budgetChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: 'rgba(25, 135, 84, 0.75)',   // Bootstrap success green
          borderColor: 'rgba(25, 135, 84, 1)',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          label: 'Expense',
          data: expenseData,
          backgroundColor: 'rgba(220, 53, 69, 0.75)',   // Bootstrap danger red
          borderColor: 'rgba(220, 53, 69, 1)',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label(ctx) {
              return ` ${ctx.dataset.label}: ${inrFmt.format(ctx.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback(value) {
              return inrFmt.format(value);
            }
          }
        }
      }
    }
  });
}

// ── Reset all inputs ─────────────────────────
function resetAll() {
  MONTHS.forEach((_, i) => {
    document.getElementById(`income-${i}`).value  = '';
    document.getElementById(`expense-${i}`).value = '';
    updateRow(i);
  });
  updateTotals();

  // Reset chart data without destroying instance
  if (budgetChart) {
    budgetChart.data.datasets[0].data = new Array(12).fill(0);
    budgetChart.data.datasets[1].data = new Array(12).fill(0);
    budgetChart.update();
  }
}

// ── Wire up event listeners ──────────────────
window.addEventListener('DOMContentLoaded', () => {
  buildTable();

  // Input listeners: update net cell + totals on every keystroke
  MONTHS.forEach((_, i) => {
    document.getElementById(`income-${i}`).addEventListener('input', () => {
      updateRow(i);
      updateTotals();
    });
    document.getElementById(`expense-${i}`).addEventListener('input', () => {
      updateRow(i);
      updateTotals();
    });
  });

  // Render / refresh chart when switching to Chart tab
  const chartTabBtn = document.getElementById('chart-tab');
  chartTabBtn.addEventListener('shown.bs.tab', () => {
    renderChart();
  });

  // Reset button
  document.getElementById('resetBtn').addEventListener('click', resetAll);

  // Download chart as PNG — opens modal to collect username
  document.getElementById('downloadChartBtn').addEventListener('click', () => {
    const modalInput = document.getElementById('modalUsernameInput');
    modalInput.value = '';
    modalInput.classList.remove('is-valid', 'is-invalid');
    document.getElementById('modalUsernameFeedback').textContent = '';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('downloadModal')).show();
  });

  // ── Modal download submit ────────────────────
  document.getElementById('modalDownloadSubmitBtn').addEventListener('click', () => {
    const modalInput = document.getElementById('modalUsernameInput');
    const value      = modalInput.value.trim();
    const errors     = validateUsername(value);

    if (errors.length > 0) {
      modalInput.classList.remove('is-valid');
      modalInput.classList.add('is-invalid');
      document.getElementById('modalUsernameFeedback').textContent =
        `✗ Invalid username — must include: ${errors.join(', ')}.`;
      return;
    }

    modalInput.classList.remove('is-invalid');
    modalInput.classList.add('is-valid');

    if (!budgetChart) renderChart();

    const link = document.createElement('a');
    link.download = `${value}.png`;
    link.href = document.getElementById('budgetChart').toDataURL('image/png');
    link.click();

    bootstrap.Modal.getInstance(document.getElementById('downloadModal')).hide();
    modalInput.value = '';
    modalInput.classList.remove('is-valid');
  });
});

// ── Pure utility functions ───────────────────

/**
 * Returns an array of validation error strings for a username.
 * An empty array means the username is valid.
 */
function validateUsername(value) {
  const errors = [];
  if (value.length < 3)             errors.push('at least 3 characters');
  if (!/[A-Z]/.test(value))         errors.push('at least one uppercase letter');
  if (!/[^A-Za-z0-9]/.test(value))  errors.push('at least one special character');
  return errors;
}

/**
 * Returns the net amount (income minus expense).
 */
function calcNet(income, expense) {
  return income - expense;
}

// ── Conditional CommonJS export (Node / Jest) ─
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MONTHS, validateUsername, calcNet, inrFmt };
}
