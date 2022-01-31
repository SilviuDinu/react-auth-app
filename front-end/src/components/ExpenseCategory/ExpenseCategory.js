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
          <h3>Category: {category}</h3>
          <h3>Total: {expenses.reduce((acc, item) => (acc += parseFloat(item.amount)), 0)} RON</h3>
        </div>
        <button onClick={() => setShowExpenses(!showExpenses)}>{showExpenses ? 'Hide details' : 'Show details'}</button>
      </div>

      {showExpenses && (
        <div className="expense-category-details">
          {expenses
            .sort((a, b) => {
              const { date: dateA } = a;
              const { date: dateB } = b;
              console.log(moment(dateA));
              // return moment(a?.prettyDate).diff(moment(b?.prettyDate));
            })
            .map((expense, index) => (
              <>
                <ExpenseCard key={index} expense={expense} />
                {index < expenses.length - 1 && <Divider />}
              </>
            ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseCategory;
