import { Divider } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useRef, useState } from 'react';
import { useToken } from '../../auth/useToken';
import { useUser } from '../../auth/useUser';
import { ExpensesContext } from '../../contexts/expensesContext';
import ExpenseCard from '../ExpenseCard/ExpenseCard';
import ShareExpenseModal from '../ShareExpenseModal/ShareExpenseModal';

const ExpenseCategory = (props) => {
  const { category, expenses } = props || {};
  const user = useUser();
  const [token] = useToken();
  const { id } = user;
  const [, setExpenses] = useContext(ExpensesContext);
  const [showExpenses, setShowExpenses] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [expenseToShare, setExpenseToShare] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const timeoutPromise = useRef();

  const handleShare = (expense) => {
    setExpenseToShare(expense);
    setShareModalVisible(true);
  };

  useEffect(() => {
    if (showSuccessMessage || showErrorMessage) {
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowErrorMessage(false);
      }, 3000);
    }
  }, [showSuccessMessage, showErrorMessage]);

  const handleDelete = async (expense) => {
    try {
      await axios.delete(`/api/expenses/${id}/delete/${expense.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expenses.splice(expenses.indexOf(expense), 1);
      setExpenses([...expenses]);
      setShowSuccessMessage(true);
    } catch (err) {
      setShowErrorMessage(true);
    }
  };

  const handleCardActions = (action, expense) => {
    switch (action) {
      case 'share':
        handleShare(expense);
        break;
      case 'delete':
        handleDelete(expense);
        break;
      default:
        return expense;
    }
  };

  const onUserSearch = (value) => {
    clearTimeout(timeoutPromise.current);
    if (!value) {
      setLoading(false);
      return;
    }
    setLoading(true);
    timeoutPromise.current = setTimeout(async () => {
      try {
        const response = await axios.get(`/api/users/${id}/get/${value}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setUsers(response.data.users);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }, 3000);
  };

  const onUserSelect = async (item) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `/api/expenses/${id}/share-expense/${expenseToShare.id}`,
        {
          email: item.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (err) {
      setShowErrorMessage(true);
      setLoading(false);
    }
  };

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
          {expenses.length > 0 &&
            expenses
              .sort((a, b) => {
                return moment(b.date).diff(moment(a.date), 'seconds');
              })
              .map((expense, index) => (
                <div key={index}>
                  <ExpenseCard expense={expense} onActionClick={handleCardActions} />
                  {/* {index < expenses.length - 1 && <Divider />} */}
                </div>
              ))}
        </div>
      )}
      <ShareExpenseModal
        expense={expenseToShare}
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        onSearch={onUserSearch}
        searchResults={users}
        loading={loading}
        onResultClick={onUserSelect}
        showSuccessMessage={showSuccessMessage}
        showErrorMessage={showErrorMessage}
      />
    </div>
  );
};

export default ExpenseCategory;
