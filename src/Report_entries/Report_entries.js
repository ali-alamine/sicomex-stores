import React, { useEffect, useState } from 'react';
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
import $ from 'jquery';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Global_services from '../Global_services/Global_services';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Report_entries() {
    const [show_loader, set_show_loader] = useState(false);
    const [all_stores, set_all_stores] = useState([]);
    useEffect(() => {
        get_all_stores();
    }, []);

    /* START -  STORE SECTION */
    const get_all_stores = () => {
        axios.get(Global_services.get_stores).then(
            response => {
                var temp_all_stores = [];
                for (var i = 0; i < response.data.length; i++) {
                    temp_all_stores.push({
                        'value': response.data[i].store_name,
                        'label': response.data[i].store_name,
                        'store_id': response.data[i].store_id,
                        'store_amount': response.data[i].amount,
                        'drawer_amount': response.data[i].drawer_amount
                    })
                }
                set_all_stores(temp_all_stores);
            }, error => {
                console.log(error);
            }
        )
    };

    const [is_open_new_store_modal, set_is_open_new_store_modal] = useState(false);
    const open_store_modal = () => {
        set_is_open_new_store_modal(true);
        set_show_loader(false);
    };

    const close_store_modal = () => { set_is_open_new_store_modal(false) };
    const [new_store_data, set_new_store_data] = useState({
        new_store_name: '',
        new_store_init_amount: 0
    });

    const handler_new_store = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        new_store_data[name] = value;
        entry_report_data.store_amount = all_stores.store_amount;
        set_new_store_data(new_store_data);
    };

    const add_new_store = () => {
        if (new_store_data.new_store_name != '') {
            set_show_loader(true)
            return axios.post(Global_services.add_new_store, new_store_data).then(
                response => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        showConfirmButton: false,
                        timer: 1000
                    });
                    set_new_store_data({
                        new_store_name: '',
                        new_store_init_amount: 0
                    })
                    get_all_stores();
                    close_store_modal();
                    set_show_loader(false);
                },
                error => {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Veuillez contacter votre développeur de logiciel',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
            );
        } else {
            Swal.fire({
                title: 'Champs obligatoires',
                text: 'Veuillez vous assurer de remplir tous les champs',
                icon: 'info',
                confirmButtonText: 'OK'
            })
        }

    };
    /* END -  STORE SECTION */

    /* START - ENTRIES REPORT DATA SECTION */
    const [selected_store_entry, set_selected_store_entry] = useState('');
    const handle_select_store = (_selectedOption) => {
        console.log(_selectedOption)
        set_selected_store_entry(_selectedOption);
        set_entry_report_data(prevState => ({
            ...prevState,
            store_id: _selectedOption.store_id,
            drawer_amount: _selectedOption.drawer_amount
        }));
        setTimeout(() => {
            calc_remain_amount();
        }, 300);
        entry_report_data.store_amount = _selectedOption.store_amount;
    };
    const [entry_report_data, set_entry_report_data] = useState({
        store_id: '',
        store_amount: '',
        drawer_amount: '',
        starting_amount: '',
        sales_amount: '',
        cash_supply_amount: '',
        cash_supply_details: [],
        cash_expense_amount: '',
        cash_expense_details: [],
        bank_deposit: 0,
        remain_amount: '',
        entry_report_date: ''
    });

    const calc_remain_amount = () => {
        var sum_in_values = 0;
        $('.entry-input-add').each(function () {
            if (parseInt(this.value)) {
                this.value = this.value.split(',').join('');
                sum_in_values += parseInt(this.value);
            } else {
                sum_in_values += 0;
            }
        });
        var sum_out_values = 0;
        $('.entry-input-sub').each(function () {
            if (parseInt(this.value)) {
                this.value = this.value.split(',').join('');
                sum_out_values += parseInt(this.value);
            } else {
                sum_out_values += 0;
            }
        });
        var total = sum_in_values - sum_out_values
        set_remain(total);
    };
    const [remain, set_remain] = useState(0);

    const handle_entry_report = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        entry_report_data[name] = value;
        calc_remain_amount();
        set_entry_report_data(entry_report_data);
    };
    /* END - ENTRIES REPORT DATA SECTION */

    /* START - CASH  DETAILS */
    const [cash_supply_details_arr, set_cash_supply_details_arr] = useState([]);
    const cash_supply_details = (data) => {
        set_cash_supply_details_arr(data);
        calc_remain_amount();
    };
    const [cash_expense_details_arr, set_cash_expense_details_arr] = useState([]);
    const cash_expense_details = (data) => {
        set_cash_expense_details_arr(data);

    };
    const [expense_total_amount, set_expense_total_amount] = useState(0);
    const get_expense_total_amount = (total_expense_amount) => {
        set_expense_total_amount(total_expense_amount);
    };
    const [supply_total_amount, set_supply_total_amount] = useState(0);
    const get_supply_total_amount = (total_supply_amount) => {
        set_supply_total_amount(total_supply_amount);
    };
    const [show_submit_loader, set_show_submit_loader] = useState(false);
    const submit_store_entry = () => {
        if (entry_report_data.sales_amount != '' && entry_report_data.store_id != '') {
            entry_report_data.cash_supply_details = cash_supply_details_arr;
            entry_report_data.cash_supply_amount = supply_total_amount;
            entry_report_data.cash_expense_details = cash_expense_details_arr;
            entry_report_data.cash_expense_amount = expense_total_amount;
            entry_report_data.remain_amount = remain;
            var temp_entry_date = moment(new Date(entry_date));
            temp_entry_date = temp_entry_date.format("YYYY-MM-DD");
            entry_report_data.entry_report_date = temp_entry_date;
            set_entry_report_data(entry_report_data);
            set_show_submit_loader(true);
            return axios.post(Global_services.add_new_store_entry, entry_report_data).then(
                response => {
                    get_all_stores();
                    set_show_submit_loader(false);
                    set_entry_report_data({
                        store_id: '',
                        sales_amount: '',
                        drawer_amount: '',
                        starting_amount: '',
                        cash_supply_amount: '',
                        cash_supply_details: [],
                        cash_expense_amount: '',
                        cash_expense_details: [],
                        bank_deposit: 0,
                        remain_amount: '',
                        entry_report_date: ''
                    });
                    set_remain(0);
                    set_selected_store_entry({ 'value': '', 'label': '', 'store_id': '', 'store_amount': '' })
                    set_supply_total_amount(0);
                    set_expense_total_amount(0);
                    set_cash_expense_details_arr([]);
                    set_cash_supply_details_arr([]);
                    doRefreshDialog(!refreshDialog)
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        showConfirmButton: false,
                        timer: 1000
                    });
                },
                error => {
                    set_show_submit_loader(false);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Veuillez contacter votre développeur de logiciel',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
            );
        } else {
            Swal.fire({
                title: 'Required fields',
                text: 'Please make sure to fill all fields',
                icon: 'info',
                confirmButtonText: 'OK'
            })
        }
    };
    const [refreshDialog, doRefreshDialog] = useState(false);
    const [entry_date, set_entry_date] = useState(new Date());
    var parse_to_number = (val) => {
        return val = val.toLocaleString();
    }
    /* END - CASH  DETAILS */

    return (
        <div className='create-new-store'>
            <button onClick={open_store_modal} className='create-store-btn btn btn-primary'>Nouveau magasin</button>
            <div className='store-data-entry row'>
                <div className='col-md-4' >
                    <div className='entry-select'>
                        {
                            all_stores.length > 0 ?
                                <div>
                                    <Select
                                        placeholder='Sélectionnez un magasin'
                                        value={selected_store_entry}
                                        onChange={handle_select_store}
                                        options={all_stores}
                                        name='store_data'
                                    />
                                </div>
                                : Global_services.show_spinner('grow', 2, 'warning')
                        }
                    </div>
                    <div className='entry'>
                        <span>Montant du tiroir </span> <input value={parse_to_number(entry_report_data.drawer_amount)} name='drawer_amount' type='text' className='entry-input-add' disabled />
                    </div>
                    <div className='entry'>
                        <span>Ventes</span> <input value={entry_report_data.sales_amount} onChange={handle_entry_report} name='sales_amount' type='number' className='entry-input-add' />
                    </div>
                    <div className='entry supply'>
                        <span>Forniussure Cash</span> <input type='number' value={supply_total_amount} disabled className='entry-input-sub' />
                        <span className='add-details'><Dialog refresh={refreshDialog} calc={calc_remain_amount} get_supply_total_amount={get_supply_total_amount} view='supply' action_name='Forniussure Cash' cash_supply_details={cash_supply_details} /></span>
                    </div>
                    <div className='entry cash'>
                        <span>Dépenses espèces</span> <input type='number' value={expense_total_amount} disabled className='entry-input-sub' />
                        <span className='add-details'><Dialog refresh={refreshDialog} calc={calc_remain_amount} get_expense_total_amount={get_expense_total_amount} view='expense' action_name='Dépenses espèces' cash_expense_details={cash_expense_details} /></span>
                    </div>
                    <div className='entry'>
                        <span>Dépôt bancaire</span> <input value={entry_report_data.bank_deposit} name='bank_deposit' onChange={handle_entry_report} type='number' className='entry-input-sub' />
                    </div>
                    <div className='entry'>
                        <span>Rester: </span> <input Style='color:black !important' type='number' value={remain} disabled />
                    </div>
                    <div className='entry'>
                        <span>Date: </span> <div className='entry-date'> <DatePicker dateFormat="dd/MM/yyyy" selected={entry_date} onChange={date => set_entry_date(date)} /> </div>
                        {/* <span>Date: </span>  <input type='date' /> */}
                    </div>
                    <div className='entry-submit'>
                        {
                            show_submit_loader ?
                                Global_services.show_spinner('grow', 2, 'success')
                                :
                                <div>
                                    <input onClick={submit_store_entry} type='submit' value='Soumettre' className='btn btn-success' />
                                </div>
                        }
                    </div>
                </div>
                <div>
                    <Add_new_check all_stores={all_stores} check_type='exp' />
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
                            <label className='input-label'>Nom du magasin</label>
                            <input onChange={handler_new_store} name='new_store_name' type="text" className="form-control" placeholder="Nom du magasin" />
                        </div>
                        <div className="form-group">
                            <label className='input-label'>Montant initial</label>
                            <input onChange={handler_new_store} name='new_store_init_amount' type="text" className="form-control" placeholder="Montant initial" />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {
                        show_loader ? <div className='on-submit-loader'>{Global_services.show_spinner('grow', 2, 'success')}</div> : <button onClick={add_new_store} className="btn btn-success">Soumettre</button>
                    }
                    <button onClick={close_store_modal} className="btn btn-danger">Annuler</button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default Report_entries