import { useState, useContext } from 'react';
import SnackBarContext from '../context/SnackBarContext';

export const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);
  function onChange(e) {
    setValue(e.target.value);
  }
  return {
    value,
    onChange
  };
};

export const useSnackBar = () => {
  const { openSnackBar, closeSnackBar } = useContext(SnackBarContext);
  
  return { openSnackBar, closeSnackBar };
};
