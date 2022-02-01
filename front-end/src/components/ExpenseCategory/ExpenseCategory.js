import { Divider } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import { useRef, useState } from 'react';
import { useToken } from '../../auth/useToken';
import { useUser } from '../../auth/useUser';
import ExpenseCard from '../ExpenseCard/ExpenseCard';
import ShareExpenseModal from '../ShareExpenseModal/ShareExpenseModal';

const ExpenseCategory = (props) => {
  const { category, expenses } = props || {};
  const user = useUser();
  const [token] = useToken();
  const { id } = user;
  const [showExpenses, setShowExpenses] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [expenseToShare, setExpenseToShare] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const timeoutPromise = useRef();

  const handleShareClick = (expense) => {
    setExpenseToShare(expense);
    setShareModalVisible(true);
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
      if (response.ok) {
        setShowSuccessMessage(true);
        setShowErrorMessage(false);
      }
      setLoading(false);
    } catch (err) {
      setShowSuccessMessage(false);
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
          {expenses
            .sort((a, b) => {
              return moment(b.date).diff(moment(a.date), 'seconds');
            })
            .map((expense, index) => (
              <div key={index}>
                <ExpenseCard expense={expense} onShareClick={handleShareClick} />
                {index < expenses.length - 1 && <Divider />}
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