import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { groupBy } from 'lodash';
import axios from 'axios';
import { ExpensesContext } from '../contexts/expensesContext';
import ExpenseCategory from '../components/ExpenseCategory/ExpenseCategory';
import { useRef } from 'react';
import { useUser } from '../auth/useUser';
import { useToken } from '../auth/useToken';
import ShareExpenseModal from '../components/ShareExpenseModal/ShareExpenseModal';
import downloadFile from '../util/download';
import moment from 'moment';

const ExpensesPage = (props) => {
  const user = useUser();
  const [token] = useToken();
  const { id } = user || {};
  const [expenses, setExpenses] = useContext(ExpensesContext);
  const [expensesCategories, setExpensesCategories] = useState([]);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [expenseToShare, setExpenseToShare] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [includeShared, setIncludeShared] = useState(true);
  const [totalThisMonth, setTotalThisMonth] = useState(0);

  const timeoutPromise = useRef();

  useEffect(() => {
    if (showSuccessMessage || showErrorMessage) {
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowErrorMessage(false);
      }, 3000);
    }
  }, [showSuccessMessage, showErrorMessage]);

  useEffect(() => {
    const categoryGroups = groupBy(expenses, 'category');
    setExpensesCategories([...Object.entries(categoryGroups)]);
  }, [expenses]);

  useEffect(() => {
    const total = expenses.reduce((acm, item) => {
      const now = moment();
      if (now.isSame(moment(item.date), 'month')) {
        return (acm += Number(parseFloat(item.amount).toFixed(2)));
      }
      return acm;
    }, 0);

    setTotalThisMonth(total);
  }, [expenses]);

  const handleCardActions = (action, expense) => {
    switch (action) {
      case 'share':
        handleShare(expense);
        break;
      case 'delete':
        handleDelete(expense);
        break;
      case 'receipt':
        handleReceipt(expense);
        break;
      default:
        return expense;
    }
  };

  const onUserSelect = async (item) => {
    setLoading(true);
    try {
      await axios.put(
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
    }, 1500);
  };

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

  const handleShare = (expense) => {
    setExpenseToShare(expense);
    setShareModalVisible(true);
  };

  const handleReceipt = async (expense) => {
    try {
      const response = await axios.get(`/api/expenses/${id}/get-receipt/${expense.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      downloadFile(
        response.data.receiptData,
        `${expense.day}-${expense.month}-${expense.year}_${expense.category}.pdf`
      );
      setShowSuccessMessage(true);
    } catch (err) {
      setShowErrorMessage(true);
    }
  };

  if (!expensesCategories?.length && expensesCategories?.length !== 0) {
    return <h1>Loading...</h1>;
  }

  if (expensesCategories?.length === 0) {
    return <h1>No expenses</h1>;
  }

  return (
    <div className="container">
      <h1 className="title">Your expenses</h1>
      <div className="options">
        <label htmlFor="include-shared">Include shared expenses to total amount</label>
        <input
          type="checkbox"
          name="include-shared"
          checked={includeShared}
          onChange={(e) => setIncludeShared(!includeShared)}
        />
        <div>Total this month: {totalThisMonth} RON</div>
      </div>
      {expensesCategories.map((expenseType, index) => {
        const [category, items] = expenseType;
        return (
          <ExpenseCategory
            key={index}
            category={category}
            expenses={includeShared ? items : items.filter((item) => !item.sharedBy)}
            handleCardActions={handleCardActions}
          />
        );
      })}

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

export default ExpensesPage;
