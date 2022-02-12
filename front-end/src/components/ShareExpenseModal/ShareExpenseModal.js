import { useLayoutEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import ExpenseCard from '../ExpenseCard/ExpenseCard';
import IosShareIcon from '@mui/icons-material/IosShare';

const ShareExpenseModal = (props) => {
  const { visible } = props;
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef();

  useLayoutEffect(() => {
    if (visible) {
      searchInputRef.current.focus();
    }
  }, [visible]);

  const onSearch = (value) => {
    setSearchValue(value);
    props.onSearch(value);
  };

  const onResultClick = (item) => {
    props.onResultClick(item);
  };

  return (
    <div className={visible ? 'modal visible' : 'modal hidden'} onClick={props.onClose}>
      <div className="modal-main" onClick={(e) => e.stopPropagation()}>
        {props.showSuccessMessage && <div className="success">Successfully saved record!</div>}
        {props.showErrorMessage && (
          <div className="fail">Uh oh... something went wrong and we couldn't save changes</div>
        )}
        <div className="share-expense-modal-summary">
          <ExpenseCard expense={props.expense} showActions={false} />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          className="user-search-input"
          placeholder="Search by user name or email"
          onChange={(e) => onSearch(e.target.value)}
          value={searchValue}
        />

        <div className="data">
          {props.loading && <h3>Loading...</h3>}
          {!props.loading &&
            props.searchResults.map((result, index) => (
              <div className="user-search-result" key={index}>
                {result.email}
                <div className="modal-search-actions">
                  {/* <PersonAddIcon alt="add friend" className="action" color="primary" onClick={() => onResultClick(result)} />} */}
                  <IosShareIcon className="action" color="primary" onClick={() => onResultClick(result)} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ShareExpenseModal;
