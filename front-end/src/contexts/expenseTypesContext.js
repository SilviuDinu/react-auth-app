import axios from 'axios';
import { useRef } from 'react';
import { createContext, useEffect, useState } from 'react';
import { useToken } from '../auth/useToken';
import { useUser } from '../auth/useUser';

const defaultValue = [
  { title: 'chirie', category: 'living' },
  { title: 'caldura', category: 'living' },
  { title: 'curent', category: 'living' },
  { title: 'gaze', category: 'living' },
  { title: 'cablu / internet', category: 'confort' },
  { title: 'intretinere', category: 'living' },
  { title: 'mancare (cumparaturi)', category: 'groceries' },
  { title: 'apa (cumparaturi)', category: 'groceries' },
  { title: 'distractie (iesit)', category: 'entertainment' },
  { title: 'electrocasnice', category: 'confort' },
  { title: 'cursuri', category: 'learning' },
  { title: 'jocuri', category: 'entertainment' },
  { title: 'mancare comandata', category: 'groceries' },
  { title: 'motorina / benzina', category: 'transport' },
  { title: 'medicamente sau ingrijire', category: 'health' },
];

export const ExpenseTypesProvider = (props) => {
  const user = useUser();
  const [token] = useToken();

  const { id } = user || {};
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [defaultExpenseTypes, setDefaultExpenseTypes] = useState(defaultValue);
  const [categories, setCategories] = useState([]);

  const firstUpdate = useRef(true);

  useEffect(() => {
    const fetchExpenseTypes = async () => {
      try {
        const response = await axios.get(`/api/expense-types/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setExpenseTypes(response.data.expenseTypes);
          setDefaultExpenseTypes((defaultValues) =>
            defaultValues.filter((defVal) => !response.data.expenseTypes.some((y) => y.title === defVal.title))
          );
          setCategories(() => {
            return Array.from(
              new Set([
                ...defaultExpenseTypes.map((val) => val?.category),
                ...response.data.expenseTypes.map((val) => val?.category),
              ])
            );
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    if (!expenseTypes.length && firstUpdate.current) {
      fetchExpenseTypes();
      firstUpdate.current = false;
    }
  }, [expenseTypes]);

  useEffect(() => {
    if (!categories.length) {
      setCategories(() => {
        return Array.from(
          new Set([...defaultExpenseTypes.map((val) => val?.category), ...expenseTypes.map((val) => val?.category)])
        );
      });
    }
  }, [categories, setCategories]);

  const value = {
    expenseTypes,
    setExpenseTypes,
    defaultExpenseTypes,
    setDefaultExpenseTypes,
    categories,
    setCategories,
  };

  return <ExpenseTypesContext.Provider value={value}>{props.children}</ExpenseTypesContext.Provider>;
};

export const ExpenseTypesContext = createContext([]);
