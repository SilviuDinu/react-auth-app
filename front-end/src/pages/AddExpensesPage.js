import axios from 'axios';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useToken } from '../auth/useToken';
import { useUser } from '../auth/useUser';
import moment from 'moment';
import { useContext } from 'react';
import { ExpensesContext } from '../contexts/expensesContext';

const expenseCategories = [
  'chirie',
  'caldura',
  'curent',
  'gaze',
  'cablu / internet',
  'intretinere',
  'mancare (cumparaturi)',
  'apa (cumparaturi)',
  'distractie (iesit)',
  'electrocasnice',
  'cursuri',
  'jocuri',
  'mancare comandata',
  'motorina / benzina',
  'medicamente sau ingrijire',
];

const AddExpensesPage = () => {
  const user = useUser();
  const [token] = useToken();

  const { id, email, isVerified, userName } = user;

  const [expenseType, setExpenseType] = useState(expenseCategories[0]);
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
          type: expenseType,
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
        <select onChange={(e) => setExpenseType(e.target.value)} value={expenseType}>
          {expenseCategories.map((expense, idx) => (
            <option key={idx} value={expense}>
              {expense}
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
      <button disabled={!amount || !date || !who || !expenseType} onClick={saveChanges}>
        Save Changes
      </button>
    </div>
  );
};

export default AddExpensesPage;
