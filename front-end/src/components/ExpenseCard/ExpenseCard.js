import IosShareIcon from '@mui/icons-material/IosShare';
import DeleteIcon from '@mui/icons-material/Delete';

const ExpenseCard = (props) => {
  const { amount, who, prettyDate, date, category, title, sharedWith, sharedBy } = props.expense || {};
  const { showActions = true } = props;

  console.log(props.expense)

  const handleShare = () => {
    props.onActionClick('share', props.expense);
  };

  const handleDelete = () => {
    props.onActionClick('delete', props.expense);
  };

  return (
    <div className="expense-card">
      <div className="expense-card-info">
        <span className="expense-card-field">{title}</span>
        <span className="expense-card-field">{amount} RON</span>
      </div>

      <div className="expense-card-info">
        <div className="expense-card-info-block">
          <span className="expense-card-field">Paid by {who}</span>
          {sharedBy && <span className="expense-card-field">Shared by: {sharedBy.userName}</span>}
        </div>

        <span className="expense-card-field">{prettyDate}</span>
      </div>
      {showActions && (
        <div className="expense-card-bottom">
          <div className="expense-card-actions">
            <div className="expense-card-action action share" onClick={handleShare}>
              <IosShareIcon color="primary" />
            </div>
            <div className="expense-card-action action delete" onClick={handleDelete}>
              <DeleteIcon className="delete-icon" color="primary" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;
