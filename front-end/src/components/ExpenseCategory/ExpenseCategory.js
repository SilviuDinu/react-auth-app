import moment from 'moment';
import { useState } from 'react';
import ExpenseCard from '../ExpenseCard/ExpenseCard';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { capitalize } from '../../util/helpers';
import { Tooltip } from '@mui/material';
import { useEffect } from 'react';
import { useRef } from 'react';
import InfoMessage from '../InfoMessage/InfoMessage';

const ExpenseCategory = (props) => {
  const { category, expenses } = props || {};
  const currentMonth = useRef(moment().format('MMMM YYYY'));
  const lastAvailableMonth = useRef(moment().format('MMMM YYYY'));
  const [showExpenses, setShowExpenses] = useState(false);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [monthFilter, setMonthFilter] = useState({
    label: moment().format('MMMM YYYY'),
    actualDate: moment().startOf('month').format('YYYY-MM-DD'),
  });
  const [months, setMonths] = useState([]);

  useEffect(() => {
    const availableMonths = [
      ...new Map(
        expenses
          ?.map((item) => {
            return {
              label: `${item.month} ${item.year}`,
              actualDate: moment(item.date).startOf('month').format('YYYY-MM-DD'),
            };
          })
          .map((item) => [item['label'], item])
      ).values(),
    ];

    setMonths(availableMonths);

    const mostRecentAvailableMonths = availableMonths.sort((a, b) => moment(b.actualDate).diff(moment(a.actualDate)));
    lastAvailableMonth.current = mostRecentAvailableMonths[0];
    setMonthFilter(mostRecentAvailableMonths[0]);
  }, [expenses]);

  useEffect(() => {
    const filtered = expenses
      .sort((a, b) => {
        return moment(b.date).diff(moment(a.date), 'seconds');
      })
      .filter((expense) => moment(expense.date).isSame(moment(monthFilter.actualDate), 'month'));

    setFilteredExpenses(filtered);
  }, [expenses, monthFilter]);

  return (
    filteredExpenses?.length > 0 && (
      <div className="expense-category-wraper">
        <div className="expense-category">
          <div className="expense-category-summary">
            <div className="expense-category-summary-info">
              <span className="expense-category-field">Category: {capitalize(category)}</span>
              <span className="expense-category-field">
                Total: {filteredExpenses.reduce((acc, item) => (acc += parseFloat(item.amount)), 0).toFixed(2)} RON
              </span>
            </div>
            <div className="expense-category-month">
              <span className="expense-category-field">{monthFilter.label}</span>
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
              <select
                name="select-month"
                defaultValue={monthFilter.label}
                onChange={(e) => setMonthFilter(months[e.target.value])}>
                {months?.map((month, idx) => (
                  <option key={idx} value={idx}>
                    {month.label}
                  </option>
                ))}
              </select>
              {filteredExpenses.length > 0 &&
                filteredExpenses.map((expense, index) => (
                  <div key={index}>
                    {currentMonth.current !== monthFilter.label &&
                      !expenses.some((exp) => {
                        const { month, year } = exp;
                        return `${month} ${year}` === currentMonth.current;
                      }) && (
                        <InfoMessage message="You do not have any expenses for the current month, so we're displaying the expenses for last available month. This won't be included when calculating the total for this month." />
                      )}
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
