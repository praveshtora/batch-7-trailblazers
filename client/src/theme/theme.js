import { createMuiTheme } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import lightBlue from '@material-ui/core/colors/lightBlue';

export default createMuiTheme({
  palette: {
    primary: teal,
    secondary: {
      light: '#ffe597',
      main: '#fdd150',
      dark: '#f3c130'
    }
  }
});

// primary: {
//   light: '#f78376',
//   main: '#E25141',
//   dark: '#dc402e'
// },
// secondary: {
//   light: '#ffe597',
//   main: '#fdd150',
//   dark: '#f3c130'
// }
