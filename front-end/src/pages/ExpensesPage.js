import { useEffect, useMemo, useState } from 'react';
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
import { getFilteredItems, getTotalThisMonth } from '../util/helpers';
import moment from 'moment';

const ExpensesPage = (props) => {
  const user = useUser();
  const [token] = useToken();
  const { id, userName } = user || {};
  const [expenses, setExpenses] = useContext(ExpensesContext);
  const [expensesCategories, setExpensesCategories] = useState([]);
  const [defaultExpenseCategories, setDefaultExpensesCategories] = useState([]);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [expenseToShare, setExpenseToShare] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [filters, setFilters] = useState({
    includeShared: true,
    paidByMeOnly: false,
    category: 'All',
    month: {
      label: moment().format('MMMM YYYY'),
      actualDate: moment().startOf('month').format('YYYY-MM-DD'),
    },
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
    setFilters({ ...filters, month: mostRecentAvailableMonths[0] });
  }, [expenses]);

  const timeoutPromise = useRef();

  const memoizedFilteredItems = useMemo(() => {
    return getFilteredItems(expenses, filters, user);
  }, [expenses, filters, user]);

  useEffect(() => {
    if (showSuccessMessage || showErrorMessage) {
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowErrorMessage(false);
      }, 3000);
    }
  }, [showSuccessMessage, showErrorMessage]);

  useEffect(() => {
    const categoryGroups = groupBy(memoizedFilteredItems, 'category');
    setExpensesCategories([...Object.entries(categoryGroups)]);
  }, [memoizedFilteredItems]);

  useEffect(() => {
    const categoryGroups = groupBy(memoizedFilteredItems, 'category');
    setDefaultExpensesCategories([...Object.entries(categoryGroups)]);
  }, [memoizedFilteredItems]);

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
        <div className="option">
          <label htmlFor="include-shared">Include shared expenses to total amount</label>
          <input
            type="checkbox"
            name="include-shared"
            checked={filters.includeShared}
            onChange={(e) => setFilters({ ...filters, includeShared: !filters.includeShared })}
          />
        </div>
        <div className="option">
          <label htmlFor="paid-by-me">Show only expenses paid by me</label>
          <input
            type="checkbox"
            name="paid-by-me"
            checked={filters.paidByMeOnly}
            onChange={(e) => setFilters({ ...filters, paidByMeOnly: !filters.paidByMeOnly })}
          />
        </div>
        <div className="option">
          Total this month: {getTotalThisMonth(memoizedFilteredItems, null, user, filters.month)} RON
        </div>
        <div className="option">
          {' '}
          <select
            name="select-category"
            defaultValue="All"
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="All">All</option>
            {defaultExpenseCategories?.map((group, idx) => {
              const [category] = group;
              return (
                <option key={idx} value={category}>
                  {category}
                </option>
              );
            })}
          </select>
        </div>
        <div className="option">
          {' '}
          <select
            name="select-month"
            defaultValue={filters.month.label}
            onChange={(e) => setFilters({ ...filters, month: months[e.target.value] })}>
            {months?.map((month, idx) => (
              <option key={idx} value={idx}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {expensesCategories.map((expenseType, index) => {
        const [category, items] = expenseType;
        return (
          <ExpenseCategory
            key={index}
            category={category}
            expenses={items}
            month={filters.month.label}
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
