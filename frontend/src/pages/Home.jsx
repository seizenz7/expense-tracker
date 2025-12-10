import React, { useState } from 'react';
function Home() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddExpense = (e) => {
    e.preventDefault();
    const newExpense = { description, amount: parseFloat(amount) };
    setExpenses([...expenses, newExpense]);
    setDescription('');
    setAmount('');
  };

  return (
    <div>
      <h2>Home</h2>
      <form onSubmit={handleAddExpense}>
        <input
          type="text"
          placeholder="Description of expense"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Add Expense</button>
      </form>
      <h3>Expenses List</h3>
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            {expense.description}: ${expense.amount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;