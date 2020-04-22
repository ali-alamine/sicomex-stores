import React, { useEffect,useState } from 'react';
import Dialog from '../Dialog/Dialog';
import Add_new_check from '../Add_new_check/Add_new_check';
import './Report_entries.css';
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Select from 'react-select';
import axios from 'axios';
import Swal from 'sweetalert2';

function Report_entries(){

    const [all_stores,set_all_stores]= useState('');
    useEffect(()=>{
        get_all_stores();
    },[]);
    /* START -  STORE SECTION */
    const get_all_stores= () => {
        axios.get('http://localhost:4000/store').then(
            response => {
                var temp_all_stores=[];
                for(var i =0;i<response.data.length;i++){
                    temp_all_stores.push({
                        'value':response.data[i].store_name,
                        'label':response.data[i].store_name,
                        'store_id':response.data[i].store_id
                    })
                }
                set_all_stores(temp_all_stores);
            },error =>{
                console.log(error);
            }
        )
    };
    const [is_open_new_store_modal,set_is_open_new_store_modal] = useState(false);
    const open_store_modal = () => {set_is_open_new_store_modal(true)};
    const close_store_modal = () => {set_is_open_new_store_modal(false)};
    const [new_store_data,set_new_store_data]= useState({
        new_store_name:'',
        new_store_init_amount:''
    })
    const handler_new_store = (e) => {
        let name=e.target.name;
        let value= e.target.value;
        new_store_data[name]=value;
        set_new_store_data(new_store_data);
    }
    const add_new_store = () => {
        return axios.post('http://localhost:4000/store',new_store_data).then(
            response=>{
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    showConfirmButton: false,
                    timer: 1000
                });
                get_all_stores();
                close_store_modal();
            },
            error =>{
                Swal.fire({
                    title: 'Error!',
                    text: 'Please Contact your software developer',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        );
    }
    const [selected_store_report,set_selected_store_report] = useState('');
    const handle_select_store = (_selectedOption) => {
        set_selected_store_report(_selectedOption)
        entry_report_data.store_id=_selectedOption.store_id;
    }
    const submit_store_entry = () => {
        console.log(entry_report_data);
    }
    /* END -  STORE SECTION */

    /* START - ENTRIES REPORT DATA SECTION */
    const [entry_report_data,set_entry_report_data] = useState({
        store_id:'',
        starting_amount:'',
        sales:'',
        cash_supply:'',
        cash_supply_details:[],
        cash_expense:'',
        cash_expense_details:[],
        bank_deposit:'',
        amount_remains:''
    });
    const handle_entry_report = (e) => {
        let name = e.target.name;
        let value =  e.target.value;
        entry_report_data[name]=value;
        set_entry_report_data(entry_report_data);
    }
    /* END - ENTRIES REPORT DATA SECTION */

    /* START - CASH  DETAILS */
    const [cash_supply_details_arr,set_cash_supply_details_arr]= useState([]);
    const cash_supply_details = (data) => {
        set_cash_supply_details_arr(data);
    }
    const [cash_expense_details_arr,set_cash_expense_details_arr]= useState([]);
    const cash_expense_details = (data) => {
        set_cash_expense_details_arr(data);
    }
    const [expense_total_amount,set_expense_total_amount]= useState([]);
    const get_expense_total_amount = (total_expense_amount) => {
        set_expense_total_amount(total_expense_amount);
    }
    const [supply_total_amount,set_supply_total_amount]= useState([]);
    const get_supply_total_amount = (total_supply_amount) => {
        set_supply_total_amount(total_supply_amount);
    }

    /* END - CASH  DETAILS */
    return (
    <div className='create-new-store'>
            <button onClick={open_store_modal} className='create-store-btn btn btn-primary'>Create New Store</button>
            <div className='store-data-entry row'>
                <div className='col-md-4' >
                    <div className='entry-select'>    
                        <Select
                            placeholder='Select Store'
                            value={selected_store_report}
                            onChange={handle_select_store}
                            options={all_stores}
                            name='store_data'
                        />
                    </div>
                    <div className='entry'>
                        <span>Starting Amount</span> <input disabled type='number' />
                    </div>
                    <div className='entry'>
                        <span>Sales</span> <input onChange={handle_entry_report} name='sales' type='number'/>
                    </div>
                    <div className='entry supply'>
                        <span>Cash Supply</span> <input type='number' value={supply_total_amount} disabled/>
                        <span className='add-details'><Dialog get_supply_total_amount={get_supply_total_amount} view='supply' action_name='Cash Supply' cash_supply_details={cash_supply_details}/></span>
                    </div>
                    <div className='entry cash'>
                        <span>Cash Expenses</span> <input type='number' value={expense_total_amount} disabled/> 
                        <span className='add-details'><Dialog get_expense_total_amount={get_expense_total_amount}  view='expense' action_name='Cash Expenses' cash_expense_details={cash_expense_details}/></span>
                    </div>
                    <div className='entry'>
                        <span>Bank Deposit</span> <input name='bank_deposit' onChange={handle_entry_report} type='number' />
                    </div>
                    <div className='entry'>
                        <span>Remain: </span> <input type='text' disabled />
                    </div>
                    <div className='entry'>
                        <span>Date: </span> <input type='date'/>
                    </div>
                    <div className='entry-submit'>
                        <input onClick={cash_expense_details} type='submit' className='btn btn-success'/>
                    </div>

                </div>
                <div>
                    <Add_new_check />
                </div>
            </div>

            {/* *****************  START - MODALS *********************************  */}
                <Modal show={is_open_new_store_modal} onHide={close_store_modal}>
                <ModalHeader>
                    <ModalTitle>Create New Store</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <div className='store-form'>
                        <div className="form-group">
                            <label className='input-label'>Store Name</label>
                            <input onChange={handler_new_store} name='new_store_name' type="text" className="form-control" placeholder="Store Name"/>
                        </div>
                        <div className="form-group">
                            <label className='input-label'>Initial Amount</label>
                            <input onChange={handler_new_store} name='new_store_init_amount' type="text" className="form-control" placeholder="Manager Name"/>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button onClick={add_new_store} type="submit" className="btn btn-success">Soumettre</button>
                    <button onClick={close_store_modal} type="button" className="btn btn-danger">Annuler</button>
                </ModalFooter>
            </Modal>
            {/* *****************  END - MODALS *********************************  */}

        </div>
        
    )

    
}

export default Report_entries