import IosShareIcon from '@mui/icons-material/IosShare';

const ExpenseCard = (props) => {
  const { amount, who, prettyDate, date, type, sharedWith, sharedBy } = props.expense || {};

  return (
    <div className="expense-card">
      <div className="expense-card-info">
        <span className="expense-card-field">{type}</span>
        <span className="expense-card-field">{amount} RON</span>
      </div>

      <div className="expense-card-info">
        <div className="expense-card-info-block">
          <span className="expense-card-field">Paid by {who}</span>
          {sharedBy && <span className="expense-card-field">Shared by: {sharedBy.userName}</span>}
        </div>

        <span className="expense-card-field">{prettyDate}</span>
      </div>
      <div className="expense-card-actions">
        <IosShareIcon color="primary" />
        {/* <IosShareIcon color="primary" /> */}
      </div>
    </div>
  );
};

export default ExpenseCard;
