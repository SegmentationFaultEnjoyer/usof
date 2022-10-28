import '@styles/app.scss'

import AppRoutes from '@/routes';

import { Provider } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import GlobalMUIStyles from '@styles/UI_Themes'
import { ToastContainer } from '@/common'

import { store } from '@/store'

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={GlobalMUIStyles}>
                <AppRoutes />
            </ThemeProvider>
            <ToastContainer theme='dark' />
        </Provider>
    )
}

export default App
