import React, { useEffect } from 'react';
import moment from 'moment';
import {
  DatePicker as MaterialDatePicker,
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
      <MaterialDatePicker
        autoOk
        variant="dialog"
        inputVariant="outlined"
        InputAdornmentProps={{ position: 'start' }}
        {...props}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatePicker;
