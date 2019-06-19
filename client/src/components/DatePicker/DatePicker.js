import React, { useEffect } from 'react';
import moment from 'moment';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

const DatePicker = props => {
  useEffect(() => {
    const { userLanguage, language } = window.navigator;
    const locale = userLanguage || language;
    moment.locale(locale);
  }, []);

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <KeyboardDatePicker
        autoOk
        variant="inline"
        inputVariant="outlined"
        InputAdornmentProps={{ position: 'start' }}
        {...props}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatePicker;
