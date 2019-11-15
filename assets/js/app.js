/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

 //import react
import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AuthContext from './contexts/AuthContext';
import CustomersPage from './pages/CustomersPage';
import HomePage from './pages/HomePage';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';
import AuthAPI from './services/AuthAPI';
import CustomerPage from './pages/CustomerPage';
import InvoicePage from './pages/InvoicePage';
import RegisterPage from './pages/RegisterPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// any CSS you require will output into a single css file (app.css in this case)
require('../css/app.css');

// Need jQuery? Install it with "yarn add jquery", then uncomment to require it.
// const $ = require('jquery');

AuthAPI.setup();

const App = ()=>{
    // ask to API if is connected
    const [isAuthenticated,setIsAuthenticated] = useState(AuthAPI.isAuthenticated());

    const NavBarWithRouter = withRouter(Navbar);

    return (
    <AuthContext.Provider value={{
        isAuthenticated,
        setIsAuthenticated
    }}>
        <HashRouter>
            <NavBarWithRouter />

            <main className="container pt-5">
                <Switch>
                    <Route path="/login" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} />
                    <PrivateRoute  path="/invoices/:id" component={InvoicePage}  />
                    <PrivateRoute  path="/invoices" component={InvoicesPage} />
                    <PrivateRoute  path="/customers/:id" component={CustomerPage}  />
                    <PrivateRoute  path="/customers" component={CustomersPage}  />
                    <Route path="/" component={HomePage} />
                </Switch>
            </main>

        </HashRouter>
        <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
    </AuthContext.Provider>
    );
}

const rootElement = document.querySelector("#app");
ReactDom.render(<App />,rootElement);