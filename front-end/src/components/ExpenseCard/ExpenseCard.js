import IosShareIcon from '@mui/icons-material/IosShare';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Tooltip from '@mui/material/Tooltip';

const ExpenseCard = (props) => {
  const { amount, who, prettyDate, date, category, title, hasReceipt, sharedBy } = props.expense || {};
  const { showActions = true } = props;

  const handleShare = () => {
    props.onActionClick('share', props.expense);
  };

  const handleDelete = () => {
    props.onActionClick('delete', props.expense);
  };

  const handleDownloadReceipt = () => {
    props.onActionClick('receipt', props.expense);
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
              <Tooltip title="Share expense">
                <IosShareIcon color="primary" />
              </Tooltip>
            </div>
            <div className="expense-card-action action delete" onClick={handleDelete}>
              <Tooltip title="Delete expense">
                <DeleteIcon className="delete-icon" color="primary" />
              </Tooltip>
            </div>
            {hasReceipt && (
              <div className="expense-card-action action download-receipt" onClick={handleDownloadReceipt}>
                <Tooltip title="Download receipt">
                  <ReceiptIcon className="receipt-icon" color="primary" />
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;
