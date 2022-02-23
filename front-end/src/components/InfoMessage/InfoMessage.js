import React from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function InfoMessage(props) {
  return (
    <div
      className="info"
      style={{
        display: 'flex',
        marginTop: '16px',
        padding: '8px',
        color: '#31708f',
        backgroundColor: '#d9edf7',
        borderRadius: 10,
      }}>
      <InfoOutlinedIcon color="primary" style={{ marginRight: 8 }} />
      <span className="info-message">{props.message}</span>
    </div>
  );
}

export default InfoMessage;
