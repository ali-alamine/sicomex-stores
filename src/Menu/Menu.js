import React from 'react';
import { BrowserRouter as Router,Switch,Route,Link,Redirect  } from "react-router-dom";
import Report_entries from '../Report_entries/Report_entries'
import Supplier from '../Supplier/Supplier'
import Invoice from '../Invoice/Invoice'
import './Menu.css';
function Menu(){

    return (
        <div className='header-menu'>
          <Router>
                <nav className="main-menu navbar navbar-expand-lg">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/Home">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Supplier">Supplier</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Invoice">Invoices</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Check">Checks</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Store Account">Bank Account</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Store Account">Reports</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Dropdown link
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <a className="dropdown-item" href="#">Action</a>
                                    <a className="dropdown-item" href="#">Another action</a>
                                    <a className="dropdown-item" href="#">Something else here</a>
                                </div>
                            </li>
                        </ul>
                        <div className="form-inline my-2 my-lg-0">
                            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                        </div>
                        </div>
                </nav>
                {/* <Route path='/'>
                    <Redirect to="/Home" />
                </Route> */}
                    <Switch>
                        <Route path="/Home">
                            <Report_entries />
                        </Route>
                        <Route path="/Report">
                            {/* <Report /> */}
                        </Route> 
                        <Route path="/Menu">
                            <Menu />
                        </Route>
                        <Route path="/Supplier">
                            <Supplier />
                        </Route>
                        <Route path="/Invoice">
                            <Invoice />
                        </Route>
                        <Route path="/Check">
                            {/* <Check /> */}
                        </Route>
                        <Route path="/Store Account">
                            {/* <Store_bank_account /> */}
                        </Route>
                    </Switch>
                </Router>
        </div>
    )
}

export default Menu;