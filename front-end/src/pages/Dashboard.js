import { groupBy, chain } from 'lodash';
import moment from 'moment';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../components/LineChart/LineChart';
import { ExpensesContext } from '../contexts/expensesContext';
import { capitalize } from '../util/helpers';

export const Dashboard = () => {
  const [expenses] = useContext(ExpensesContext);
  const [expensesCategories, setExpensesCategories] = useState([]);
  const [expensesByTitles, setExpensesByTitles] = useState([]);
  const [showStatsByExpenseTitle, setShowStatsByExpenseTitle] = useState(false);
  const [showStatsByExpenseCategory, setShowStatsByExpenseCategory] = useState(true);
  const [timeInterval, setTimeInterval] = useState('month');

  useEffect(() => {
    const categoryGroups = groupBy(expenses, 'category');
    setExpensesCategories([...Object.entries(categoryGroups)]);
  }, [expenses]);

  useEffect(() => {
    const expenseTypesGroups = groupBy(expenses, 'title');
    setExpensesByTitles([...Object.entries(expenseTypesGroups)]);
  }, [expenses]);

  const getTimeInterval = (item) => {
    switch (timeInterval) {
      case 'month':
        return `${item.month}_${item.year}`;
      case 'year':
        return `${item.year}`;
      case 'day':
        return `${item.day}_${item.month}_${item.year}`;
    }
  };

  if (!expensesCategories.length && !expensesByTitles.length) {
    return (
      <div className="container">
        <h2>Sorry, you do not have any data to display</h2>
        <h2>
          Please go to{' '}
          <b>
            <Link to="/dashboard/add-expense">Add expense</Link>
          </b>{' '}
          page to add your first expense.
        </h2>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard">
        <h1>This is dashboard page. here are your stats:</h1>

        <div className="stats-controls">
          <div className="control">
            <label htmlFor="show-stats-by-category">Show stats by their big category (food, living)</label>
            <input
              type="checkbox"
              name="show-stats-by-category"
              checked={showStatsByExpenseCategory}
              onChange={(e) => setShowStatsByExpenseCategory(!showStatsByExpenseCategory)}
            />
          </div>
          <div className="control">
            <label htmlFor="show-stats-by-title">Show stats for each expense title</label>
            <input
              type="checkbox"
              name="show-stats-by-title"
              checked={showStatsByExpenseTitle}
              onChange={(e) => setShowStatsByExpenseTitle(!showStatsByExpenseTitle)}
            />
          </div>
          <div className="control">
            <label htmlFor="show-by-week-month">Choose the interval for your charts</label>
            <select name="show-by-week-month" defaultValue={'month'} onChange={(e) => setTimeInterval(e.target.value)}>
              <option value="month">Per Month</option>
              <option value="day">Per Day</option>
              <option value="year">Per Year</option>
            </select>
          </div>
        </div>

        {showStatsByExpenseCategory &&
          expensesCategories?.map((expense, index) => {
            const [category, items] = expense;

            const sortedItems = items.sort((a, b) => {
              return moment(a.date).diff(moment(b.date), 'seconds');
            });

            const groupedItems = chain(sortedItems)
              .groupBy((item) => getTimeInterval(item))
              .value();

            const data = Object.keys(groupedItems).map((key) => {
              let name;

              if (key.indexOf('_') > -1) {
                const splitted = key.split('_');
                if (splitted.length > 2) {
                  name = `${splitted[0]} ${splitted[1]} ${splitted[2]}`;
                } else {
                  name = `${splitted[0]} ${splitted[1]}`;
                }
              } else {
                name = key;
              }

              return {
                name,
                date: groupedItems[key].prettyDate,
                amount: Number(groupedItems[key].reduce((acc, item) => (acc += parseFloat(item.amount)), 0).toFixed(2)),
              };
            });

            return (
              <div className="chart-area" key={index}>
                <h2 className="chart-title">{capitalize(category)}</h2>
                <LineChart data={data} />
              </div>
            );
          })}

        {showStatsByExpenseTitle &&
          expensesByTitles?.map((expense, index) => {
            const [title, items] = expense;

            const sortedItems = items.sort((a, b) => {
              return moment(a.date).diff(moment(b.date), 'seconds');
            });

            const groupedItems = chain(sortedItems)
              .groupBy((item) => getTimeInterval(item))
              .value();

            const data = Object.keys(groupedItems).map((key) => {
              let name;

              if (key.indexOf('_') > -1) {
                const splitted = key.split('_');
                if (splitted.length > 2) {
                  name = `${splitted[0]} ${splitted[1]} ${splitted[2]}`;
                } else {
                  name = `${splitted[0]} ${splitted[1]}`;
                }
              } else {
                name = key;
              }

              return {
                name,
                date: groupedItems[key].prettyDate,
                amount: Number(groupedItems[key].reduce((acc, item) => (acc += parseFloat(item.amount)), 0).toFixed(2)),
              };
            });

            return (
              <div className="chart-area" key={index}>
                <h2 className="chart-title">{capitalize(title)}</h2>
                <LineChart data={data} />
              </div>
            );
          })}
      </div>
    </div>
  );
};
