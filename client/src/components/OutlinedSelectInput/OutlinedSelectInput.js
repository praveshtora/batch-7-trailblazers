import React, { useState, useEffect, useRef } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import './OutlinedSelectInput.css';

const OutlinedSelectInput = ({
  label,
  data,
  className = '',
  ...rest
}) => {
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => setLabelWidth(inputLabel.current.offsetWidth), []);

  const menuItems = data
    ? data.map((item, index) => (
        <MenuItem key={`${index}-${item}`} value={item}>
          {item}
        </MenuItem>
      ))
    : null;

  return (
    <FormControl variant="outlined" className={className}>
      <InputLabel ref={inputLabel} htmlFor={`select-${label}`}>
        {label}
      </InputLabel>
      <Select
        input={
          <OutlinedInput
            labelWidth={labelWidth}
            name={label}
            id={`select-${label}`}
          />
        }
        {...rest}
      >
        <MenuItem value="" disabled>
          <em>None</em>
        </MenuItem>
        {menuItems}
      </Select>
    </FormControl>
  );
};

export default OutlinedSelectInput;
