import IosShareIcon from '@mui/icons-material/IosShare';

const ExpenseCard = (props) => {
  const { amount, who, prettyDate, date, type, sharedWith, sharedBy } = props.expense || {};

  return (
    <div className="expense-card">
      <div className="expense-card-info">
        <h3>{type}</h3>
        <h3>{amount} RON</h3>
      </div>

      <div className="expense-card-info">
        <div className="expense-card-info-block">
          <h4>Paid by {who}</h4>
          {sharedBy && <span>Shared by: {sharedBy.userName}</span>}
        </div>

        <h3>{prettyDate}</h3>
      </div>
      <div className="expense-card-actions">
        <IosShareIcon color="primary" />
        {/* <IosShareIcon color="primary" /> */}
      </div>
    </div>
  );
};

export default ExpenseCard;
