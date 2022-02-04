import React, { useState } from 'react';
import { useContext } from 'react';
import { ExpenseTypesContext } from '../contexts/expenseTypesContext';
import AddIcon from '@mui/icons-material/Add';
import { useUser } from '../auth/useUser';
import { useToken } from '../auth/useToken';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';

function AddExpenseCategoryPage(props) {
  const user = useUser();
  const [token] = useToken();

  const { id } = user;

  const { expenseTypes, setExpenseTypes, defaultExpenseTypes, setDefaultExpenseTypes, categories, setCategories } =
    useContext(ExpenseTypesContext);
  const [newExpenseType, setNewExpenseType] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [preferManualInput, setPreferManualInput] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    if (showSuccessMessage || showErrorMessage) {
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowErrorMessage(false);
      }, 3000);
    }
  }, [showSuccessMessage, showErrorMessage]);

  const handleExpenseTypeAdd = (expenseType) => {
    setExpenseTypes([...expenseTypes, expenseType]);

    const index = defaultExpenseTypes.indexOf(expenseType);
    defaultExpenseTypes.splice(index, 1);
    setDefaultExpenseTypes([...defaultExpenseTypes]);
    setCategories([...categories, expenseType.category]);
  };

  const handleExpenseTypeRemove = (expenseType) => {
    const index = expenseTypes.indexOf(expenseType);
    expenseTypes.splice(index, 1);
    setExpenseTypes([...expenseTypes]);

    setDefaultExpenseTypes([...defaultExpenseTypes, expenseType]);

    const categoriesIndex = categories.indexOf(expenseType.category);
    categories.splice(categoriesIndex, 1);
    setCategories([...categories]);
  };

  const handleAddNewCategory = (e) => {
    setNewCategory(e.target.value);
  };

  const onNewExpenseTypeAdded = (e) => {
    if (!newExpenseType || !newCategory) {
      return;
    }
    const newExpense = {
      title: newExpenseType,
      category: newCategory,
    };
    setExpenseTypes([...expenseTypes, newExpense]);
    setCategories([...categories, newCategory]);
    setNewExpenseType('');
    setNewCategory('');
  };

  const handlePreferManualInputChange = (e) => {
    e.stopPropagation();
    setPreferManualInput(!preferManualInput);
  };

  const handleSave = async () => {
    try {
      await axios.post(
        `/api/expense-types/${id}/add-expense-type`,
        {
          expenseTypes,
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

  return (
    <div className="container">
      <h1>Manage your expense categories</h1>
      <div className="add-expense-category">
        {showSuccessMessage && <div className="success">Action successful!</div>}
        {showErrorMessage && <div className="fail">{"Uh oh... something went wrong and we couldn't save changes"}</div>}
        <div className="add-expense-category-input">
          <label htmlFor="add-expense-type-input">Write down a new expense name</label>
          <input
            type="text"
            name="add-expense-type-input"
            value={newExpenseType}
            onChange={(e) => setNewExpenseType(e.target.value)}
          />
          {!preferManualInput ? (
            <>
              <label htmlFor="select-category">Pick up an existing category from this list or </label>
              <button className="btn-like-link" onClick={handlePreferManualInputChange}>
                write a new one
              </button>
              <select name="select-category" defaultValue={'default'} onChange={(e) => setNewCategory(e.target.value)}>
                <option value="default" disabled hidden>
                  Please choose a category...
                </option>
                {categories?.map((category, idx) => (
                  <option key={idx} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              <label htmlFor="add-new-category-input">Write down a new category or </label>
              <button className="btn-like-link" onClick={handlePreferManualInputChange}>
                pick one from the existing list
              </button>
              <input type="text" name="add-new-category-input" value={newCategory} onChange={handleAddNewCategory} />
            </>
          )}
          <button disabled={!newCategory || !newExpenseType} type="submit" onClick={onNewExpenseTypeAdded}>
            Add
          </button>
          {/* <DividerWithText text="OR" backgroundColorForText="#fff" /> */}
        </div>
        {!!expenseTypes?.length && (
          <div className="expense-types-list-wrapper">
            <h3 className="expense-types-list-title">My own expense types</h3>
            <div className="expense-types-list">
              {expenseTypes
                ?.sort((a, b) => a.title?.localeCompare(b?.title))
                ?.map((expenseType, index) => (
                  <div key={index} className="expense-type" onClick={(e) => handleExpenseTypeRemove(expenseType)}>
                    <span className="expense-type-title">{expenseType.title}</span>
                    <CloseIcon className="expense-type-action" color="primary" />
                  </div>
                ))}
            </div>
          </div>
        )}
        {!!defaultExpenseTypes?.length && (
          <div className="expense-types-list-wrapper">
            <h3 className="expense-types-list-title">Suggested expense types</h3>
            <div className="expense-types-list">
              {defaultExpenseTypes
                ?.sort((a, b) => a.title?.localeCompare(b?.title))
                ?.map((expenseType, index) => (
                  <div key={index} className="expense-type" onClick={(e) => handleExpenseTypeAdd(expenseType)}>
                    <span className="expense-type-title">{expenseType.title}</span>
                    <AddIcon className="expense-type-action" color="primary" />
                  </div>
                ))}
            </div>
          </div>
        )}
        <div className="expense-types-actions">
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default AddExpenseCategoryPage;
