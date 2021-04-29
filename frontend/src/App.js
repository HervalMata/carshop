import React from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import { pink } from '@material-ui/core/colors'

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
    <ThemeProvider theme={theme} >
      <h1>Aplicação React</h1>
    </ThemeProvider>
)

export default App;
