import React from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';

function FieldWithTooltip(props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>{props.title}</span>
      <Tooltip
        style={{ marginLeft: '8px' }}
        title={props.tooltip}>
        <HelpOutlineIcon className="help-icon" color="primary" />
      </Tooltip>
    </div>
  );
}

export default FieldWithTooltip;
