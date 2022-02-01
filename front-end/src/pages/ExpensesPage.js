import { useEffect, useState } from 'react';
import { useContext } from 'react';
import ExpenseCard from '../components/ExpenseCard/ExpenseCard';
import { groupBy } from 'lodash';

import { ExpensesContext } from '../contexts/expensesContext';
import ExpenseCategory from '../components/ExpenseCategory/ExpenseCategory';

const ExpensesPage = (props) => {
  const [expenses, setExpenses] = useContext(ExpensesContext);
  const [expensesCategories, setExpensesCategories] = useState([]);

  useEffect(() => {
    const categoryGroups = groupBy(expenses, 'type');
    setExpensesCategories([...Object.entries(categoryGroups)]);
    console.log('setExpensesCategories useEffect');
  }, [expenses]);

  if (!expensesCategories?.length && expensesCategories?.length !== 0) {
    return <h1>Loading...</h1>;
  }

  if (expensesCategories?.length === 0) {
    return <h1>No expenses</h1>;
  }

  return (
    <div className="container">
      {expensesCategories.map((category, index) => {
        const [type, items] = category;
        return <ExpenseCategory key={index} category={type} expenses={items} />;
      })}
    </div>
  );
};

export default ExpensesPage;
