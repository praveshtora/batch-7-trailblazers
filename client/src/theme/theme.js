import { createMuiTheme } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';

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
