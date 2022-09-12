import '@/styles/app.scss'

import Login from '@/forms/Login/Login.jsx';
import ErrorPage from '@/pages/ErrorPage';

import { Routes, Route } from 'react-router-dom';

import { Provider } from 'react-redux';

import { store } from '@/store/store'

function App() {
    return (
        <Provider store={store}>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='*' element={<ErrorPage />} />
            </Routes>
        </Provider>
    )
}

export default App
