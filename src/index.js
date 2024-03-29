import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Report_entries from './Report_entries/Report_entries';
import Menu from './Menu/Menu';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';

ReactDOM.render(
    <React.StrictMode>
    <div className='container-fluid'>
      <App />
    </div>  
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
