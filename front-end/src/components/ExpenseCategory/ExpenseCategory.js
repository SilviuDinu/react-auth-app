import moment from 'moment';
import { useState } from 'react';
import ExpenseCard from '../ExpenseCard/ExpenseCard';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { capitalize } from '../../util/helpers';
import { Tooltip } from '@mui/material';

const ExpenseCategory = (props) => {
  const { category, expenses } = props || {};
  const [showExpenses, setShowExpenses] = useState(false);

  return (
    expenses?.length > 0 && (
      <div className="expense-category-wraper">
        <div className="expense-category">
          <div className="expense-category-summary">
            <div className="expense-category-summary-info">
              <span className="expense-category-field">Category: {capitalize(category)}</span>
              <span className="expense-category-field">
                Total: {expenses.reduce((acc, item) => (acc += parseFloat(item.amount)), 0).toFixed(2)} RON
              </span>
            </div>
            <div className="expand-more-icon-wrapper" onClick={() => setShowExpenses(!showExpenses)}>
              {showExpenses ? (
                <KeyboardArrowUpIcon style={{ width: '40px', height: '40px' }} color="primary" />
              ) : (
                <Tooltip title="Expand more items">
                  <ExpandMoreIcon style={{ width: '40px', height: '40px' }} color="primary" />
                </Tooltip>
              )}
            </div>
          </div>

          {showExpenses && (
            <div className="expense-category-details">
              {expenses.length > 0 &&
                expenses
                  .sort((a, b) => {
                    return moment(b.date).diff(moment(a.date), 'seconds');
                  })
                  .map((expense, index) => (
                    <div key={index}>
                      <ExpenseCard expense={expense} onActionClick={props.handleCardActions} />
                    </div>
                  ))}
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default ExpenseCategory;
