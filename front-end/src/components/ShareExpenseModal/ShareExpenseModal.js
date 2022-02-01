import { useState } from 'react';
import ExpenseCard from '../ExpenseCard/ExpenseCard';

const ShareExpenseModal = (props) => {
  const [searchValue, setSearchValue] = useState('');

  const onSearch = (value) => {
    setSearchValue(value);
    props.onSearch(value);
  };

  const onResultClick = (item) => {
    props.onResultClick(item);
  };

  return (
    <div className={props.visible ? 'modal visible' : 'modal hidden'}>
      <div className="modal-main">
        {props.showSuccessMessage && <div className="success">Successfully saved record!</div>}
        {props.showErrorMessage && (
          <div className="fail">Uh oh... something went wrong and we couldn't save changes</div>
        )}
        <div className="share-expense-modal-summary">
          <ExpenseCard expense={props.expense} showActions={false} />
        </div>
        <input
          type="text"
          placeholder="Search by user name or email"
          onChange={(e) => onSearch(e.target.value)}
          value={searchValue}
        />

        <button onClick={props.onClose}>Close</button>

        <div className="data">
          {props.loading && <h3>Loading...</h3>}
          {!props.loading &&
            props.searchResults.map((result) => <p onClick={() => onResultClick(result)}>{result.email}</p>)}
        </div>
      </div>
    </div>
  );
};

export default ShareExpenseModal;
