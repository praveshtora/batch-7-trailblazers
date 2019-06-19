import { useState, useContext } from 'react';
import SnackBarContext from '../context/SnackBarContext';

export const useFormInput = (initialValue, useDirectValue) => {
  const [value, setValue] = useState(initialValue);
  function onChange(e) {
    if (useDirectValue) setValue(e);
    else setValue(e.target.value);
  }
  return {
    value,
    onChange,
  };
};

export const useSnackBar = () => {
  const { openSnackBar, closeSnackBar } = useContext(SnackBarContext);
  
  return { openSnackBar, closeSnackBar };
};
