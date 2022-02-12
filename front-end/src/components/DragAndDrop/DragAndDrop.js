import React, { useState, useRef } from 'react';
import get from 'lodash/get';
import { fileValidator, preventBrowserDefaults } from '../../util/dragAndDrop';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const DragAndDrop = ({ children, config, data, setData }) => {
  let [dragOverlay, setDragOverlay] = useState(false);
  const [error, setError] = useState(false);
  const [uploadedFile, setUploadedFile] = useState('');
  let dragCounter = useRef(0);
  const fileInputRef = useRef();

  const handleDrag = (e) => {
    preventBrowserDefaults(e);
  };
  const handleDragIn = (e) => {
    preventBrowserDefaults(e);
    dragCounter.current++;
    if (get(e, 'dataTransfer.items.length') > 0) {
      setDragOverlay(true);
    }
  };
  const handleDragOut = (e) => {
    preventBrowserDefaults(e);
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverlay(false);
    }
  };
  const handleDrop = (e) => {
    const files = get(e, 'dataTransfer.files');
    preventBrowserDefaults(e);
    setDragOverlay(false);
    setError(false);
    dragCounter.current = 0;
    const { isValidFile, errVal } = fileValidator(files, config);
    if (!isValidFile) {
      if (errVal) {
        setError(errVal);
      }
      return false;
    }
    fileReader(files);
  };

  const handleFiles = (e) => {
    const files = e.target.files;
    if (!files || !files.length) {
      return;
    }
    preventBrowserDefaults(e);
    setError(false);
    const { isValidFile, errVal } = fileValidator(files, config);
    if (!isValidFile) {
      if (errVal) {
        setError(errVal);
      }
      return false;
    }
    fileReader(files);
  };

  const removeFiles = (e) => {
    fileInputRef.current.value = null;
    setUploadedFile(null);
    setData(null);
  };

  const fileReader = (files) => {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (loadEvt) => {
      setData(loadEvt.target.result);
    };
    setUploadedFile(files[0]);
  };

  const dragOverlayClass = dragOverlay ? 'overlay' : '';
  return (
    <div>
      {error && <p className="error">{error}</p>}
      <div
        className={`drag-container ${dragOverlayClass}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}>
        {(uploadedFile && uploadedFile.name) || <span className="upload-title">Upload any receipts in PDF format</span>}

        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf"
          hidden={true}
          title=""
          value=""
          onChange={handleFiles}
        />

        {children}

        <div className="upload-buttons">
          {!data && (
            <button onClick={() => fileInputRef.current.click()}>
              <FileUploadIcon color="primary" /> Upload
            </button>
          )}
          {data && <button onClick={removeFiles}>Remove</button>}
        </div>
      </div>
    </div>
  );
};

export default DragAndDrop;
