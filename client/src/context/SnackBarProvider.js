import React, { useState } from 'react';
import SnackBarContext from './SnackBarContext';
import SnackBar from '../components/SnackBar';

const SnackBarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [snackBarProp, setSnackBarProp] = useState({
    message: '',
    type: 'info'
  });

  const openSnackBar = (type = 'success', message = '') => {
    setSnackBarProp({ message, type });
    setOpen(true);
  };
  const closeSnackBar = () => setOpen(false);
  return (
    <SnackBarContext.Provider value={{ openSnackBar, closeSnackBar }}>
      {children}
      <SnackBar open={open} {...snackBarProp} handleClose={closeSnackBar} />
    </SnackBarContext.Provider>
  );
};
export default SnackBarProvider;
