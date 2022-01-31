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

  useEffect(async () => {
    if (expensesLength.current < expenses.length) {
      try {
        const response = await axios.get(`/api/expenses/${id}/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setExpenses(response.data.expenses);
          expensesLength.current = response.data.expenses.length;
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  }, [expenses]);

  useEffect(() => {}, []);

  return <ExpensesContext.Provider value={[expenses, setExpenses]}>{props.children}</ExpensesContext.Provider>;
};

export const ExpensesContext = createContext(defaultValue);
