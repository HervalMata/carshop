import React from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import { pink } from '@material-ui/core/colors'
import 'bootstrap/dist/css/bootstrap.min.css'
import './global.css'
import Routes from './Routes';
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Alert, Loading, Notify } from "./view/components";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: pink[500]
    },
  },
  props: {
    MuiTextField: {
      variant: 'outlined',
      fullWidth: true
    },
    MuiSelect: {
      variant: 'outlined',
      fullWidth: true
    }
  }
})

const App = () => (
    <Provider store={store}>
      <ThemeProvider theme={theme} >
        <Alert />
        <Notify />
        <Loading />
        <Routes />
      </ThemeProvider>
    </Provider>
)

export default App;
