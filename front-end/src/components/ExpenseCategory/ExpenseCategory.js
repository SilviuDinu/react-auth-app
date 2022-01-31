import { Divider } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import ExpenseCard from '../ExpenseCard/ExpenseCard';

const ExpenseCategory = (props) => {
  const { category, expenses } = props || {};
  const [showExpenses, setShowExpenses] = useState(false);

  return (
    <div className="expense-category">
      <div className="expense-category-summary">
        <div className="expense-category-summary-info">
          <span className="expense-category-field">Category: {category}</span>
          <span className="expense-category-field">
            Total: {expenses.reduce((acc, item) => (acc += parseFloat(item.amount)), 0)} RON
          </span>
        </div>
        <button onClick={() => setShowExpenses(!showExpenses)}>{showExpenses ? 'Hide details' : 'Show details'}</button>
      </div>

      {showExpenses && (
        <div className="expense-category-details">
          {expenses
            .sort((a, b) => {
              return moment(b.date._d).diff(a.date._d, 'seconds');
            })
            .map((expense, index) => (
              <div key={index}>
                <ExpenseCard expense={expense} />
                {index < expenses.length - 1 && <Divider />}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseCategory;
