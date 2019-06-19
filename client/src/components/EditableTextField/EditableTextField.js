import React from 'react';
import './EditableTextField.css';

const EditableTextField = ({ className, ...props }) => (
  <div className={`EditableTextField ${className}`}>
    <input {...props} />
  </div>
);

export default EditableTextField;
