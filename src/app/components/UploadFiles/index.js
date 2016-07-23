import React, { PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import styles from './style.css';

export default function UploadFiles({ children, multiple, onUpload }) {
  return (
    <div>
      <Dropzone
        className={styles.uploadFiles}
        onDrop={onUpload}
        multiple={multiple}
      >
        <div className={styles.content}>
          {children}
        </div>
      </Dropzone>
    </div>
  );
}

UploadFiles.propTypes = {
  children: PropTypes.any,
  multiple: PropTypes.bool,
  onUpload: PropTypes.func.isRequired,
};
