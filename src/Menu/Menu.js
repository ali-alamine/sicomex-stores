import React from 'react';
import { BrowserRouter as Router,Switch,Route,Link,Redirect  } from "react-router-dom";
import Report_entries from '../Report_entries/Report_entries';
import Supplier from '../Supplier/Supplier';
import Invoice from '../Invoice/Invoice';
import Check from '../Check/Check';
import Nav  from 'react-bootstrap/Nav';
import Navbar  from 'react-bootstrap/Navbar';
import './Menu.css';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Global_services from '../Global_services/Global_services';
import Store_bank_acc from '../Store_bank_acc/Store_bank_acc';

function Menu(){
    return (
        <div className='header-menu'>
          <Router>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand>Petit Prix</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Link className='nav-link' to="/Home">Entrée de rapport</Link>
                        <Link className='nav-link' to="/Supplier">Fournisseuses</Link>
                        <Link className='nav-link' to="/Invoice">Factures</Link>
                        <Link className='nav-link' to="/Check">Chèques</Link>
                        <Link className='nav-link' to="/Store_acc">Compte bancaire</Link>
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
                
                    </Nav>
                    <div className='logout-div'><PowerSettingsNewIcon className='logout-icon'/></div>
                </Navbar.Collapse>
                </Navbar>
                <Route path='/'>
                    <Redirect to="/Home" />
                </Route>
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
                    <Route path="/Store_acc">
                        <Store_bank_acc />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

export default Menu;