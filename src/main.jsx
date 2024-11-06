import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter as Router} from "react-router-dom";
import AuthContextProvider from "./context/AuthContext";
import SavedParksProvider from "./context/SavedParksContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>

     <Router>
      <AuthContextProvider>
          <SavedParksProvider>
        <App/>
          </SavedParksProvider>
      </AuthContextProvider>
     </Router>

    </React.StrictMode>,
)
