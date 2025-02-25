
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from "react-redux"
import { store } from "./app/store"
import Context from './components/Context.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Context>
        <Provider store={store}>
          <App />
        </Provider>
    </Context>

  </React.StrictMode>,
)