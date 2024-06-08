let balance = 0;
let totalIncome = 0;
let totalExpenses = 0;
let transactions = [];

let incomeExpenseChart;

function initializeChart() {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  incomeExpenseChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Receitas",
          data: [],
          backgroundColor: "#36A2EB",
        },
        {
          label: "Despesas",
          data: [],
          backgroundColor: "#FF6384",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                label += R$ ${context.parsed.y.toFixed(2)};
              }
              return label;
            },
          },
        },
      },
    },
  });
}

function addTransaction(type) {
  const amountInput = document.getElementById("amount");
  const descriptionInput = document.getElementById("description");
  const amount = parseFloat(amountInput.value);
  const description = descriptionInput.value;

  if (isNaN(amount) || description === "") {
    alert("Por favor, insira um valor e uma descrição válidos.");
    return;
  }

  const transaction = {
    amount: type === "income" ? amount : -amount,
    description: description,
    type: type,
  };

  transactions.push(transaction);
  balance += transaction.amount;
  if (type === "income") {
    totalIncome += amount;
  } else {
    totalExpenses += amount;
  }

  updateSummary();
  addTransactionToList(transaction);
  updateChart(transaction);

  amountInput.value = "";
  descriptionInput.value = "";
}

function updateSummary() {
  document.getElementById(
    "balance"
  ).textContent = Saldo atual: R$ ${balance.toFixed(2)};
  document.getElementById(
    "totalIncome"
  ).textContent = Receitas totais: R$ ${totalIncome.toFixed(2)};
  document.getElementById(
    "totalExpenses"
  ).textContent = Despesas totais: R$ ${totalExpenses.toFixed(2)};
}

function addTransactionToList(transaction) {
  const transactionList = document.getElementById("transactionList");
  const listItem = document.createElement("li");
  listItem.textContent = `${
    transaction.description
  }: R$ ${transaction.amount.toFixed(2)}`;
  listItem.className = transaction.type;
  transactionList.appendChild(listItem);
}

function updateChart(transaction) {
  const labels = incomeExpenseChart.data.labels;
  const incomeData = incomeExpenseChart.data.datasets[0].data;
  const expenseData = incomeExpenseChart.data.datasets[1].data;

  if (transaction.type === "income") {
    if (!labels.includes("Receitas")) {
      labels.push("Receitas");
      incomeData.push(totalIncome);
      expenseData.push(0);
    } else {
      const index = labels.indexOf("Receitas");
      incomeData[index] = totalIncome;
    }
  } else {
    const index = labels.indexOf(transaction.description);
    if (index > -1) {
      expenseData[index] += Math.abs(transaction.amount);
    } else {
      labels.push(transaction.description);
      incomeData.push(0);
      expenseData.push(Math.abs(transaction.amount));
    }
  }
  incomeExpenseChart.update();
}

// Initialize the chart on page load
window.onload = function () {
  initializeChart();
};