const formExp = document.getElementById("expense-form");
const transactionList = document.getElementById("transactionList");
const savedData = "expenses"

// Total, Income, Expense

const totalBalanceEl = document.getElementById("totalBalance");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");


const categoryIcons = {
    food: "🍔",
    travel: "🚗",
    shopping: "🛍️",
    bills: "💡",
    salary: "💼"
};


let expenses = []

formExp.addEventListener("submit", (e) => {
    e.preventDefault()

    const description = document.getElementById("description").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value.toLowerCase();
    const type = document.querySelector('#expense-form input[name="type"]:checked').value;

    const exp = {
        id: crypto.randomUUID().slice(0, 5),
        description,
        amount,
        category,
        type,
    }

    expenses.push(exp);
    saveList();
    render();
    formExp.reset()

    console.log(expenses);
})


// Render Data
function render() {
    transactionList.innerHTML = expenses
        .map((e) => {
            const isIncome = e.type === "income";
            const sign = isIncome ? "+" : "-";

            return `
                <li class="transaction-item ${e.type}-item">
                    <div class="transaction-left">

                        <div class="transaction-icon income-icon">
                            ${categoryIcons[e.category]}
                        </div>

                        <div class="transaction-info">
                            <h3>${e.description}</h3>

                            <div class="transaction-meta">
                                <span class="category-badge">
                                    ${e.category}
                                </span>
                            </div>
                        </div>

                    </div>

                    <div class="transaction-right">
                        <strong class="transaction-amount ${e.type}-amount">
                            <span>${sign} ₹</span>${e.amount}
                        </strong>

                        <button
                            class="delete-btn"
                            data-id="${e.id}"
                        >
                            🗑
                        </button>
                    </div>
                </li>
            `;
        })
        .join("");
    updateTotals();
}

// Save Data Local Storage
function saveList() {
    localStorage.setItem(savedData, JSON.stringify(expenses));
}

// Load Data
function loadList() {
    try {
        return JSON.parse(localStorage.getItem(savedData)) || [];
    } catch {
        return [];
    }
}

expenses = loadList();
render();

// Update Total
function updateTotals() {
    const totalIncome = expenses
        .filter((e) => e.type === "income")
        .reduce((sum, e) => sum + e.amount, 0);

    const totalExpense = expenses
        .filter((e) => e.type === "expense")
        .reduce((sum, e) => sum + e.amount, 0)

    const balance = totalIncome - totalExpense

    totalBalanceEl.textContent = balance
    totalIncomeEl.textContent = totalIncome
    totalExpenseEl.textContent = totalExpense
}

// Delete Data
transactionList.addEventListener("click", (e) => {
    if (!e.target.classList.contains("delete-btn")) return;

    const id = e.target.dataset.id;
    expenses = expenses.filter((expense) => expense.id !== id);

    saveList();
    render();
})