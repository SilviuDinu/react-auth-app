import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useToken } from '../auth/useToken';
import { useUser } from '../auth/useUser';
import moment from 'moment';
import { useContext } from 'react';
import { ExpensesContext } from '../contexts/expensesContext';
import { ExpenseTypesContext } from '../contexts/expenseTypesContext';

const AddExpensesPage = () => {
  const user = useUser();
  const [token] = useToken();

  const { id, email, isVerified, userName } = user;
  const { expenseTypes } = useContext(ExpenseTypesContext);

  const [selectedExpenseType, setSelectedExpenseType] = useState(expenseTypes[0]?.title);
  const [peopleWhoCanPay, setPeopleWhoCanPay] = useState([userName]);
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useContext(ExpensesContext);
  const [who, setWho] = useState(peopleWhoCanPay[0]);
  const [date, setDate] = useState(moment());
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    const fetchPeopleWhoCanPay = async () => {
      try {
        const response = await axios.get(`/api/users/${id}/get-trusted`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setPeopleWhoCanPay([...peopleWhoCanPay, ...response.data.users?.map((person) => person.userName)]);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    if (peopleWhoCanPay.length <= 1) {
      fetchPeopleWhoCanPay();
    }
  }, [peopleWhoCanPay]);

  useEffect(() => {
    if (showSuccessMessage || showErrorMessage) {
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowErrorMessage(false);
      }, 3000);
    }
  }, [showSuccessMessage, showErrorMessage]);

  const saveChanges = async () => {
    try {
      const response = await axios.put(
        `/api/expenses/${id}/add-new`,
        {
          category: expenseTypes.find((expense) => expense.title === selectedExpenseType).category,
          title: selectedExpenseType,
          amount,
          who,
          date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data) {
        setShowSuccessMessage(true);
        setExpenses([...expenses, response.data.expense]);
      }
    } catch (err) {
      setShowErrorMessage(true);
    }
  };

  if (!expenseTypes.length) {
    return (
      <div className="container">
        <h1>Oops...</h1>
        <h2>Sorry, you do not have any expense types associated with your account.</h2>
        <h2>
          Please go to{' '}
          <b>
            <Link to="/dashboard/add-expense-category">Add expense category</Link>
          </b>{' '}
          page to manage your expense types.
        </h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Hello {email}</h1>
      {!isVerified && <div className="fail">You won't be able to make any changes until you verify your email.</div>}
      {showSuccessMessage && <div className="success">Successfully saved record!</div>}
      {showErrorMessage && <div className="fail">Uh oh... something went wrong and we couldn't save changes</div>}
      <h2>{date.format('MMMM YYYY')}</h2>
      <label>
        Amount (RON):
        <input type="text" onChange={(e) => setAmount(e.target.value)} value={amount} placeholder="100.00" />
      </label>
      <label>
        Expense type / category:
        <select onChange={(e) => setSelectedExpenseType(e.target.value)} value={selectedExpenseType}>
          {expenseTypes?.map((expense, idx) => (
            <option key={idx} value={expense.title}>
              {expense.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        Who paid:
        <select onChange={(e) => setWho(e.target.value)} value={who}>
          {peopleWhoCanPay.map((person, idx) => (
            <option key={idx} value={person}>
              {person}
            </option>
          ))}
        </select>
      </label>
      <label>
        Date:
        <input type="date" onChange={(e) => setDate(moment(e.target.value))} value={date.format('yyyy-MM-DD')} />
      </label>
      <hr />
      <button disabled={!amount || !date || !who || !selectedExpenseType} onClick={saveChanges}>
        Save Changes
      </button>
    </div>
  );
};

export default AddExpensesPage;
