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
  const [expensesTotalPerMonth, setExpensesTotalPerMonth] = useState({});
  const [showStatsByExpenseTitle, setShowStatsByExpenseTitle] = useState(false);
  const [includeShared, setIncludeShared] = useState(true);
  const [showStatsByExpenseCategory, setShowStatsByExpenseCategory] = useState(true);
  const [timeInterval, setTimeInterval] = useState('month');
  const [limitTo, setLimitTo] = useState(null);
  const [chartLoading, setChartLoading] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLimitTo = (category, value, index, isTitle = false) => {
    turnOnLoading(index);
    setLimitTo(value);

    switch (isTitle) {
      case true:
        if (value !== null) {
          const groups = groupBy(expenses, 'title');
          groups[category] = groups[category].slice(Math.max(groups[category].length - value, 0));
          setExpensesByTitles([...Object.entries(groups)]);
          turnOffLoading(index);
        } else {
          const categoryGroups = groupBy(expenses, 'title');
          setExpensesByTitles([...Object.entries(categoryGroups)]);
          turnOffLoading(index);
        }
        break;
      case false:
        if (value !== null) {
          const groups = groupBy(expenses, 'category');
          groups[category] = groups[category].slice(Math.max(groups[category].length - value, 0));
          setExpensesCategories([...Object.entries(groups)]);
          turnOffLoading(index);
        } else {
          const categoryGroups = groupBy(expenses, 'category');
          setExpensesCategories([...Object.entries(categoryGroups)]);
          turnOffLoading(index);
        }
    }
  };

  const turnOnLoading = (index) => {
    chartLoading[index] = true;
    setChartLoading(chartLoading);
  };

  const turnOffLoading = (index) => {
    chartLoading[index] = false;
    setChartLoading(chartLoading);
  };

  useEffect(() => {
    setLoading(true);
    const categoryGroups = groupBy(expenses, 'category');
    setExpensesCategories([...Object.entries(categoryGroups)]);
    setLoading(false);
  }, [expenses]);

  useEffect(() => {
    setLoading(true);
    const expenseTypesGroups = groupBy(expenses, 'title');
    setExpensesByTitles([...Object.entries(expenseTypesGroups)]);
    setLoading(false);
  }, [expenses]);

  useEffect(() => {
    setLoading(true);
    const filteredItems = includeShared ? expenses : expenses.filter((item) => !item.sharedBy);

    if (!filteredItems.length) {
      return;
    }

    const sortedItems = filteredItems.sort((a, b) => {
      return moment(a.date).diff(moment(b.date), 'seconds');
    });

    const groupedItems = chain(sortedItems)
      .groupBy((item) => `${item.month}_${item.year}`)
      .value();

    const data = Object.keys(groupedItems).map((key) => {
      const splitted = key.split('_');

      return {
        name: `${splitted[0]} ${splitted[1]}`,
        date: groupedItems[key].prettyDate,
        amount: Number(groupedItems[key].reduce((acc, item) => (acc += parseFloat(item.amount)), 0).toFixed(2)),
      };
    });

    setExpensesTotalPerMonth(data);
    setLoading(false);
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
        {loading ? (
          <h2>Loading...</h2>
        ) : (
          <>
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
                <label htmlFor="include-shared">Include shared expenses to total amount</label>
                <input
                  type="checkbox"
                  name="include-shared"
                  checked={includeShared}
                  onChange={(e) => setIncludeShared(!includeShared)}
                />
              </div>
              <div className="control">
                <label htmlFor="show-by-week-month">Choose the interval for your charts</label>
                <select
                  name="show-by-week-month"
                  defaultValue={'month'}
                  onChange={(e) => setTimeInterval(e.target.value)}>
                  <option value="month">Per Month</option>
                  <option value="day">Per Day</option>
                  <option value="year">Per Year</option>
                </select>
              </div>
            </div>

            <div
              className="chart-wrapper"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}>
              {!!expensesTotalPerMonth && (
                <div className="chart-area">
                  <h2 className="chart-title">Total spent each month</h2>
                  <LineChart data={expensesTotalPerMonth} />
                </div>
              )}

              {showStatsByExpenseCategory &&
                expensesCategories?.map((expense, index) => {
                  if (chartLoading[index]) {
                    return <h3 key={index}>Loading...</h3>;
                  }

                  const [category, items] = expense;

                  const filteredItems = includeShared ? items : items.filter((item) => !item.sharedBy);

                  if (!filteredItems.length) {
                    return;
                  }

                  const sortedItems = filteredItems.sort((a, b) => {
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
                        name = `${splitted[0]} ${splitted[1].substring(0, 3)} ${splitted[2]}`;
                      } else {
                        name = `${splitted[0]} ${splitted[1]}`;
                      }
                    } else {
                      name = key;
                    }

                    return {
                      name,
                      date: groupedItems[key].prettyDate,
                      amount: Number(
                        groupedItems[key].reduce((acc, item) => (acc += parseFloat(item.amount)), 0).toFixed(2)
                      ),
                    };
                  });

                  return (
                    <div className="chart-area" key={index}>
                      <h2 className="chart-title">{capitalize(category)}</h2>
                      <LineChart data={data} />
                      <div className="chart-controls">
                        {timeInterval === 'day' && (
                          <div
                            className="chart-control"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <div onClick={(e) => handleLimitTo(category, null, index)}>All days</div>
                            {data.length > 6 && <div onClick={(e) => handleLimitTo(category, 7, index)}>7 days</div>}
                          </div>
                        )}
                        {timeInterval === 'month' && (
                          <div
                            className="chart-control"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <div onClick={(e) => handleLimitTo(category, null, index)}>All months</div>
                            {data.length > 5 && <div onClick={(e) => handleLimitTo(category, 6, index)}>6 months</div>}
                            {data.length > 2 && <div onClick={(e) => handleLimitTo(category, 3, index)}>3 months</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

              {showStatsByExpenseTitle &&
                expensesByTitles?.map((expense, index) => {
                  const [title, items] = expense;

                  const filteredItems = includeShared ? items : items.filter((item) => !item.sharedBy);

                  if (!filteredItems.length) {
                    return;
                  }

                  const sortedItems = filteredItems.sort((a, b) => {
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
                        name = `${splitted[0]} ${splitted[1].substring(0, 3)} ${splitted[2]}`;
                      } else {
                        name = `${splitted[0]} ${splitted[1]}`;
                      }
                    } else {
                      name = key;
                    }

                    return {
                      name,
                      date: groupedItems[key].prettyDate,
                      amount: Number(
                        groupedItems[key].reduce((acc, item) => (acc += parseFloat(item.amount)), 0).toFixed(2)
                      ),
                    };
                  });

                  return (
                    <div className="chart-area" key={index}>
                      <h2 className="chart-title">{capitalize(title)}</h2>
                      <LineChart data={!limitTo ? data : data.slice(Math.max(data.length - limitTo, 0))} />
                      <div className="chart-controls">
                        {timeInterval === 'day' && (
                          <div
                            className="chart-control"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <div onClick={(e) => handleLimitTo(title, null, index, 'title')}>All days</div>
                            {data.length > 6 && (
                              <div onClick={(e) => handleLimitTo(title, 7, index, 'title')}>7 days</div>
                            )}
                          </div>
                        )}
                        {timeInterval === 'month' && (
                          <div
                            className="chart-control"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <div onClick={(e) => handleLimitTo(title, null, index, 'title')}>All months</div>
                            {data.length > 5 && (
                              <div onClick={(e) => handleLimitTo(title, 6, index, 'title')}>6 months</div>
                            )}
                            {data.length > 2 && (
                              <div onClick={(e) => handleLimitTo(title, 3, index, 'title')}>3 months</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
