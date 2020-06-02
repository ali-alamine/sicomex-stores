import React from 'react';
import { BrowserRouter as Router,Switch,Route,Link,Redirect  } from "react-router-dom";
import Report_entries from '../Report_entries/Report_entries'
import Supplier from '../Supplier/Supplier'
import Invoice from '../Invoice/Invoice'
import Check from '../Check/Check'
import './Menu.css';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
function Menu(){

    return (
        <div className='header-menu'>
          <Router>
                <nav className="main-menu navbar navbar-expand-lg">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/Home">Entrée de rapport</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Supplier">fournisseuses</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Invoice">Factures</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Check">Chèques</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Store Account">Compte bancaire</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Rapports
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <a className="dropdown-item" href="#">Dépenses de magasin</a>
                                    <a className="dropdown-item" href="#">La fourniture</a>
                                    <a className="dropdown-item" href="#">Dépôts de banque</a>
                                </div>
                            </li>
                        </ul>
                            <div><PowerSettingsNewIcon /></div>
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
                            <Check />
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