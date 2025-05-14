// DOM Elements
const budgetInput = document.getElementById('budget-input');
const setBudgetBtn = document.getElementById('set-budget-btn');
const remainingBudgetEl = document.getElementById('remaining-budget');
const expenseForm = document.getElementById('expense-form');
const expenseCards = document.getElementById('expense-cards');
const categoryChartCanvas = document.getElementById('category-chart');
const monthlyChartCanvas = document.getElementById('monthly-chart');

let totalBudget = 0;
let expenses = [];

// GSAP Animations
gsap.from(".header h1", { opacity: 0, y: -50, duration: 1 });
gsap.from(".header p", { opacity: 0, y: 50, duration: 1, delay: 0.5 });

// Set Budget
setBudgetBtn.addEventListener('click', () => {
  totalBudget = parseFloat(budgetInput.value);
  if (isNaN(totalBudget) || totalBudget <= 0) {
    alert('Please enter a valid budget amount!');
    return;
  }
  updateRemainingBudget();
  budgetInput.value = '';
  gsap.to("#remaining-budget", { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
});

// Add Expense
expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const expenseName = document.getElementById('expense-name').value;
  const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
  const expenseCategory = document.getElementById('expense-category').value;

  if (!expenseName || isNaN(expenseAmount) || expenseAmount <= 0 || !expenseCategory) {
    alert('Please fill out all fields correctly!');
    return;
  }

  expenses.push({ name: expenseName, amount: expenseAmount, category: expenseCategory });
  addExpenseCard({ name: expenseName, amount: expenseAmount, category: expenseCategory });
  updateRemainingBudget();
  updateCharts();

  expenseForm.reset();
});

// Update Remaining Budget
function updateRemainingBudget() {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = totalBudget - totalExpenses;
  remainingBudgetEl.textContent = remainingBudget.toFixed(2);

  if (remainingBudget < 0) {
    remainingBudgetEl.style.color = 'red';
  } else {
    remainingBudgetEl.style.color = 'green';
  }
}

// Add Expense Card
function addExpenseCard(expense) {
  const card = document.createElement('div');
  card.className = 'col-md-4';
  card.innerHTML = `
    <div class="glass-card">
      <h5>${expense.name}</h5>
      <p>Amount: $${expense.amount}</p>
      <p>Category: ${expense.category}</p>
    </div>
  `;
  expenseCards.appendChild(card);
  gsap.from(card, { opacity: 0, y: 50, duration: 0.5 });
}

// Update Charts
function updateCharts() {
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // Pie Chart for Categories
  new Chart(categoryChartCanvas, {
    type: 'pie',
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: ['#e94560', '#53354a', '#1a1a2e', '#16213e'],
      }],
    },
  });

  // Bar Chart for Budget Breakdown
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = totalBudget - totalExpenses;

  new Chart(monthlyChartCanvas, {
    type: 'bar',
    data: {
      labels: ['Total Budget', 'Total Expenses', 'Remaining Balance'],
      datasets: [{
        data: [totalBudget, totalExpenses, remainingBudget],
        backgroundColor: ['#e94560', '#53354a', '#16213e'],
      }],
    },
  });
}