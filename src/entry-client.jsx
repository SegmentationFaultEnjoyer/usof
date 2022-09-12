import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { BrowserRouter } from 'react-router-dom';


const AppRoot = document.getElementById('app');

ReactDOM.createRoot(AppRoot).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
