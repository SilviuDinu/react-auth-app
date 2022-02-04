import React from 'react';

function DividerWithText(props) {
  return (
    <div className="divider-with-text">
      <span className="divider-with-text-content" style={{ backgroundColor: props.backgroundColorForText || '#fff' }}>
        {props.text}
      </span>
    </div>
  );
}

export default DividerWithText;
