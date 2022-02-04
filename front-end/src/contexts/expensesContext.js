import axios from 'axios';
import { useRef } from 'react';
import { createContext, useEffect, useState } from 'react';
import { useToken } from '../auth/useToken';
import { useUser } from '../auth/useUser';

const defaultValue = [];

export const ExpensesProvider = (props) => {
  const user = useUser();
  const [token] = useToken();

  const { id } = user;
  const [expenses, setExpenses] = useState(defaultValue);
  const expensesLength = useRef(-1);
  const firstUpdate = useRef(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`/api/expenses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setExpenses(response.data.expenses);
          expensesLength.current = response.data.expenses.length;
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    if (!expenses.length && firstUpdate.current) {
      fetchExpenses();
      firstUpdate.current = false;
    }
  }, [expenses]);

  return <ExpensesContext.Provider value={[expenses, setExpenses]}>{props.children}</ExpensesContext.Provider>;
};

export const ExpensesContext = createContext(defaultValue);
