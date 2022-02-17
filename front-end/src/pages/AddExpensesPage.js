import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToken } from '../auth/useToken';
import { useUser } from '../auth/useUser';
import moment from 'moment';
import { useContext } from 'react';
import { ExpensesContext } from '../contexts/expensesContext';
import { ExpenseTypesContext } from '../contexts/expenseTypesContext';
import { isEqual } from 'lodash';
import DragAndDrop from '../components/DragAndDrop/DragAndDrop';
import { useRef } from 'react';
import FieldWithTooltip from '../components/FieldWIthTooltip/FieldWithTooltip';

const config = {
  allowedFileFormats: ['application/pdf'],
  fileSizeMBLimit: 20,
  filesLimit: 1,
};

const AddExpensesPage = () => {
  const user = useUser();
  const [token] = useToken();

  const { id, email, isVerified, userName } = user || {};
  const { expenseTypes, setExpenseTypes, defaultExpenseTypes, categories, setCategories } =
    useContext(ExpenseTypesContext);

  const [selectedExpenseType, setSelectedExpenseType] = useState(
    expenseTypes[0]?.title || defaultExpenseTypes[0].title
  );
  const [selectedCategory, setSelectedCategory] = useState(
    expenseTypes[0]?.category || defaultExpenseTypes[0].category
  );
  const [manualInput, setManualInput] = useState(false);

  const [peopleWhoCanPay, setPeopleWhoCanPay] = useState([userName]);
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useContext(ExpensesContext);
  const [who, setWho] = useState(peopleWhoCanPay[0]);
  const [date, setDate] = useState(moment());
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [receiptData, setReceiptData] = useState('');
  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchPeopleWhoCanPay = async () => {
      try {
        const response = await axios.get(`/api/users/${id}/get-trusted`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        fetchedRef.current = true;

        if (response.data) {
          setPeopleWhoCanPay([...peopleWhoCanPay, ...response.data.users?.map((person) => person.userName)]);
        }
      } catch (err) {
        fetchedRef.current = true;
        console.log(err.message);
      }
    };

    if (peopleWhoCanPay.length <= 1 && !fetchedRef.current) {
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

  useEffect(() => {
    if (!manualInput) {
      setSelectedExpenseType(expenseTypes[0]?.title || defaultExpenseTypes[0].title);
      setSelectedCategory(expenseTypes[0]?.category || defaultExpenseTypes[0].category);
    } else {
      setSelectedExpenseType('');
      setSelectedCategory('');
    }
  }, [manualInput]);

  const saveChanges = async () => {
    try {
      const response = await axios.put(
        `/api/expenses/${id}/add-new`,
        {
          category: selectedCategory,
          title: selectedExpenseType,
          amount: parseFloat(amount).toFixed(2),
          who,
          date,
          receiptData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data) {
        setShowSuccessMessage(true);
        setExpenses([...expenses, response.data.expense]);

        const obj = { title: selectedExpenseType, category: selectedCategory };
        const canAddNewExpenseType =
          selectedExpenseType && selectedCategory && !expenseTypes.some((type) => isEqual(type, obj));

        if (canAddNewExpenseType) {
          setExpenseTypes([...expenseTypes, obj]);

          addExpenseType(obj);
        }
      }
    } catch (err) {
      setShowErrorMessage(true);
    }
  };

  const addExpenseType = async (obj) => {
    try {
      await axios.post(
        `/api/expense-types/${id}/add-expense-type`,
        {
          expenseTypes: [...expenseTypes, obj],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowSuccessMessage(true);
    } catch (err) {
      setShowErrorMessage(true);
      console.log(err.message);
    }
  };

  const handleSelectExpenseName = (e) => {
    setSelectedExpenseType(e.target.value);
    const selectedCat = expenseTypes.find((type) => type.title === e.target.value).category;
    setSelectedCategory(selectedCat);
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
      <div className="add-expense">
        {!isVerified && <div className="fail">You won't be able to make any changes until you verify your email.</div>}
        {showSuccessMessage && <div className="success">Successfully saved record!</div>}
        {showErrorMessage && <div className="fail">Uh oh... something went wrong and we couldn't save changes</div>}
        <h2>{date.format('MMMM YYYY')}</h2>
        <label>
          Amount (RON):
          <input type="text" onChange={(e) => setAmount(e.target.value)} value={amount} placeholder="100.00" />
        </label>

        {!manualInput ? (
          <label>
            Choose expense name from the list or{' '}
            <button className="btn-like-link" onClick={(e) => setManualInput(!manualInput)}>
              Add a new one
            </button>
            <select onChange={handleSelectExpenseName} defaultValue={selectedExpenseType}>
              {expenseTypes?.map((expense, idx) => (
                <option key={idx} value={expense.title}>
                  {expense.title}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div style={{ width: '100%' }}>
            Type a new expense name and choose a suited category from next list or{' '}
            <button className="btn-like-link" onClick={(e) => setManualInput(!manualInput)}>
              choose a name from the previous list
            </button>
            <input type="text" value={selectedExpenseType} onChange={(e) => setSelectedExpenseType(e.target.value)} />
          </div>
        )}
        {manualInput ? (
          <>
            <label>
              <FieldWithTooltip
                tooltip="Can't find the right category? Go to Add Expense Category page to add a new category"
                title="Expense category:"
              />
              <select
                name="select-category"
                defaultValue={'default'}
                onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="default" disabled hidden>
                  Please choose a category...
                </option>
                {categories?.map((category, idx) => (
                  <option key={idx} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <hr />
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
              Category: {selectedCategory}
            </div>
            <hr />
          </>
        )}
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
        <div className="drag-and-drop-area" style={{ width: '100%' }}>
          <DragAndDrop
            data={receiptData}
            setData={setReceiptData}
            config={config}
            style={{ padding: 18 }}></DragAndDrop>
        </div>
        <hr />
        <button disabled={!amount || !date || !who || !selectedExpenseType || !selectedCategory} onClick={saveChanges}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AddExpensesPage;
