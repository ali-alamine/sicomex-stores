import React from 'react';
import ReactSpinner from 'react-bootstrap-spinner';
import './Global_services.css';
var is_prod=false;
is_prod = window.location.href.includes('localhost') ? false: true;
var base_url ='';
base_url= is_prod ? 'https://api.petitprix.live' : 'http://localhost:4000';


class Global_services extends React.Component {
    /* Show Loader on response success */
    static show_spinner = (type,size,color) => {
        return (
            <div className='loader'>
                <ReactSpinner type={type} color={color} size={size} />
            </div>
        )
    }
    static get_stores= base_url+'/store';
    static add_new_store= base_url+'/store';
    static get_starting_amount= base_url+'/starting_amount';
    static add_new_store_entry= base_url+'/add_new_store_entry';
    static search_store_by_name = base_url+'/search_store_by_name';
    static get_bank_account = base_url+'/get_bank_account';

    static get_suppliers = base_url+'/supplier';
    static get_checks = base_url+'/get_checks';
    static set_check_paid = base_url+'/set_check_paid';
    static set_check_unpaid = base_url+'/set_check_unpaid';
    static update_check = base_url+'/update_check';
    static pin_check = base_url+'/pin_check';
    static un_pin_check = base_url+'/un_pin_check';
    static delete_check = base_url+'/delete_check';
    static search_check_number = base_url+'/search_check';
    static get_assigned_invoices = base_url+'/get_assigned_invoices';

    static update_invoice = base_url+'/update_invoice';
    static delete_invoice = base_url+'/delete_invoice';
    static get_invoices = base_url+'/invoice';
    static add_new_invoice = base_url+'/invoice';
    static pin_invoice = base_url+'/pin_invoice';
    static un_pin_invoice = base_url+'/un_pin_invoice';
    static search_invoice_number = base_url+'/search_invoice';

    static pin_supplier = base_url+'/pin_supplier';
    static un_pin_supplier = base_url+'/un_pin_supplier';
    static add_new_supplier = base_url+'/supplier';
    static update_supplier = base_url+'/update_supplier';
    static delete_supplier = base_url+'/delete_supplier';
    static search_supplier_by_name = base_url+'/search_supplier_by_name';
    static advanced_search_suppliers = base_url+'/advanced_search_suppliers';
    static get_supplier_account = base_url+'/get_supplier_account';
    
    static search_invoice_by_number = base_url+'/get_invoice_by_number';
    static add_new_check = base_url+'/add_new_check';

    static advanced_search_invoice = base_url+'/advanced_search_invoice';
    static advanced_search_bank_check = base_url+'/advanced_search_bank_check';
    
    static get_store_expenses = base_url+'/get_store_expenses';

    /* Login */
    static check_login = base_url+'/check_login';
    
}

export default Global_services;