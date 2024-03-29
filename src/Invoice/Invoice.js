import React, { useEffect, useState } from 'react';
import './Invoice.css';
import Modal from "react-bootstrap/Modal";
import Common_filter from '../Common_filter/Common_filter';
import { columns, data } from "./Invoice_columns";
import Popup from "../Context_menu/Invoice_popup";
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
import "antd/dist/antd.css";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Table } from "antd";
import 'react-notifications/lib/notifications.css';
import Global_services from '../Global_services/Global_services';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Checkbox } from 'antd';

function Invoice() {
    useEffect(() => {
        get_suppliers();
        get_invoices();
        get_all_stores();
    }, []);

    /* Main table loader */
    const [show_main_loader, set_show_main_loader] = useState(false);
    /* Invoice modal */
    const [is_open_new_inv_modal, set_is_open_new_inv_modal] = useState(false);
    const close_new_inv_modal = () => { set_is_open_new_inv_modal(false); }
    const open_new_inv_modal = () => {
        set_is_open_new_inv_modal(true);
        set_popup_menu({ popup: { visible: false } });
    };

    /* Get all stores */
    const [all_stores, set_all_stores] = useState([]);
    const get_all_stores = () => {
        axios.get(Global_services.get_stores).then(
            response => {
                var temp_all_stores = [];
                for (var i = 0; i < response.data.length; i++) {
                    temp_all_stores.push({
                        'value': response.data[i].store_name,
                        'label': response.data[i].store_name,
                        'store_id': response.data[i].store_id
                    })
                }
                set_all_stores(temp_all_stores);
            }, error => {
                console.log(error);
            }
        )
    };
    var [paid_invoice, set_paid_invoice] = useState(false);
    var [edit_paid_invoice, set_edit_paid_invoice] = useState(false);

    /* Store SELECT */
    const [selected_store_invoice, set_selected_store_invoice] = useState('');
    const handle_select_store = (_selectedOption) => {
        set_selected_store_invoice(_selectedOption);
        new_invoice_data.store_id = _selectedOption.store_id;
    }

    /* Get all Suppliers*/
    const [supplier_list, set_supplier_list] = useState([]);
    const get_suppliers = () => {
        axios.get(Global_services.get_suppliers).then(
            response => {
                console.log(response.data)
                var temp_supplier_list = [];
                for (var i = 0; i < response.data.length; i++) {
                    temp_supplier_list.push({
                        'value': response.data[i].supplier_name,
                        'label': response.data[i].supplier_name,
                        'supplier_id': response.data[i].supplier_id,
                        'supplier_amount': response.data[i].supplier_amount,
                        'supplier_name': response.data[i].supplier_name,
                    })
                }
                set_supplier_list(temp_supplier_list);
            }, error => {
                console.log(error);
            }
        )
    };
    /* Supplier SELECT */
    const [selected_supplier_invoice, set_selected_supplier_invoice] = useState('');
    const handle_select_supplier = (_selectedOption) => {
        set_selected_supplier_invoice(_selectedOption);
        new_invoice_data.supplier_id = _selectedOption.supplier_id;
    }

    /* Invoice Date */
    const [invoice_date, set_invoice_date] = useState(new Date());

    /* New Invoice Form */
    const [new_invoice_data, set_new_invoice_data] = useState({
        supplier_id: '',
        store_id: '',
        invoice_number: '',
        invoice_amount: '',
        invoice_date: '',
        is_invoice_cash_paid: false
    })

    /* Handle New Invoice data */
    const handle_new_invoice = (e) => {
        set_new_invoice_data({ ...new_invoice_data, [e.target.name]: e.target.value })
    }

    const [show_submit_invoice_loader, set_show_submit_invoice_loader] = useState(false);
    /* Submit Invoice */
    const add_new_invoice = () => {
        if (new_invoice_data.supplier_id != '' && new_invoice_data.store_id != '' && new_invoice_data.invoice_amount != '' && new_invoice_data.invoice_number != '') {
            set_show_submit_invoice_loader(true);
            var temp_invoice_date = moment(new Date(invoice_date));
            temp_invoice_date = temp_invoice_date.format("YYYY-MM-DD");
            new_invoice_data.invoice_date = temp_invoice_date;
            new_invoice_data.is_invoice_cash_paid = paid_invoice;
            axios.post(Global_services.add_new_invoice, new_invoice_data).then(
                response => {
                    set_show_submit_invoice_loader(false);
                    if (response.data == 'DUPLICATE_INV_NUM') {
                        Swal.fire({
                            icon: 'info',
                            title: new_invoice_data.invoice_number,
                            text: 'Le numéro de facture est utilisé dans une autre facture',
                            showConfirmButton: true,
                            // timer: 1000
                        });
                    } else {
                        createNotification('success', 'Added');
                        get_invoices();
                        reset_invoice();
                        close_new_inv_modal()
                        set_popup_menu({ popup: { visible: false } });
                    }
                }, error => {
                    set_show_submit_invoice_loader(false);
                    console.log(error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Veuillez contacter votre développeur de logiciel',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
            )
        } else {
            set_show_submit_invoice_loader(false);
            Swal.fire({
                icon: 'warning',
                title: 'Please Fill required fields',
                showConfirmButton: true,
                // timer: 1000
            });
        }
    }

    /*Reset invoice form after successfully added */
    const reset_invoice = () => {
        set_new_invoice_data({
            supplier_id: '',
            store_id: '',
            invoice_number: '',
            invoice_amount: '',
            is_invoice_cash_paid: false,
            invoice_date: ''
        })
        set_selected_store_invoice({ "label": "", "value": "", "store_id": "" });
        set_selected_supplier_invoice({ "label": "", "value": "", "supplier_id": "" });
    }

    /* Assign response to invoice list */
    const assign_response_to_invoice_list = (response) => {
        if (response.data == 'EMPTY_RESULT') {
            set_invoices_list([])
        } else {
            let invoices = response.data;
            set_show_main_loader(false);
            invoices.map(el => {
                let date = moment(new Date(el.invoice_date));
                el.invoice_date = date.format("DD/MM/YYYY")
            })
            set_invoices_list(invoices);
        }
    }

    /* Get Invoices */
    const [invoices_list, set_invoices_list] = useState([]);
    const get_invoices = function () {
        set_show_main_loader(true);
        axios.get(Global_services.get_invoices).then(
            response => {
                set_show_main_loader(false);
                assign_response_to_invoice_list(response)
            }, error => {
                set_show_main_loader(false);
                console.log(error.data);
            }
        )
    }

    /* Open Invoice Details */
    const pay_invoice = (record) => {
        Swal.fire({
            title: 'Payer la facture',
            text: "Êtes-vous sûr de vouloir payer la facture ?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'oui, payer'
        }).then((result) => {
            if (result.value) {
                set_show_main_loader(true);
                axios.post(Global_services.pay_invoice, record).then(
                    response => {
                        set_show_main_loader(false);
                        get_invoices();
                        set_popup_menu({ popup: { visible: false } });
                        set_show_main_loader(false);
                    }, error => {
                        set_show_main_loader(false);
                        console.log(error.data);
                    }
                )
            } else {

                set_popup_menu({ popup: { visible: false } });
            }
        })
    }

    /*Edit Invoice Date */
    const [edit_invoice_date, set_edit_invoice_date] = useState(moment(new Date(), 'DD-MM-YYYY'));
    const [edit_invoice_data, set_edit_invoice_data] = useState({
        invoice_id: '',
        supplier_id: '',
        supplier_amount: '',
        store_id: '',
        edit_invoice_number: '',
        edit_invoice_amount: '',
        edit_old_invoice_amount: '',
        edit_invoice_date: '',
        edit_paid_invoice: ''
    })

    /* Slide Notification */
    function createNotification(type, message) {
        switch (type) {
            case 'info':
                NotificationManager.info('Info', message, 1500);
                break;
            case 'success':
                NotificationManager.success('Success', message, 1500);
                break;
            case 'warning':
                NotificationManager.warning('Warning', message, 1500);
                break;
            case 'error':
                NotificationManager.error('Error', message, 1500, () => {
                    alert('Veuillez contacter votre développeur de logiciel');
                });
                break;
        }

    };
    /* Handle New Invoice data */
    const handle_edit_invoice = (e) => {
        set_edit_invoice_data({ ...edit_invoice_data, [e.target.name]: e.target.value });
    }

    /* Edit Invoice */
    const [is_open_edit_invoice_modal, set_is_open_edit_invoice_modal] = useState(false);
    const close_edit_invoice_modal = () => {
        set_is_open_edit_invoice_modal(false);
        reset_after_update();
        set_popup_menu({ popup: { visible: false } });
    }

    /* EDIT Store SELECT */
    const [selected_edit_store_invoice, set_selected_edit_store_invoice] = useState('');
    const handle_edit_select_store = (_selectedOption) => {
        set_selected_edit_store_invoice(_selectedOption);
        edit_invoice_data.store_id = _selectedOption.store_id;
    }

    /* EDIT Supplier SELECT */
    const [selected_edit_supplier_invoice, set_selected_edit_supplier_invoice] = useState('');
    const handle_edit_select_supplier = (_selectedOption) => {
        set_selected_edit_supplier_invoice(_selectedOption);
        edit_invoice_data.supplier_id = _selectedOption.supplier_id;
    }

    /* Reset Invoice after update */
    const reset_after_update = () => {
        set_edit_invoice_data({
            invoice_id: '',
            supplier_id: '',
            store_id: '',
            edit_invoice_number: '',
            edit_invoice_amount: '',
            edit_invoice_date: '',
            edit_paid_invoice: false
        })
        set_selected_edit_store_invoice({ 'label': '', 'value': '', 'store_id': '' });
        set_selected_edit_supplier_invoice({ 'label': '', 'value': '', 'store_id': '' });
    }

    const set_invoice_paid = (val) => {
        paid_invoice = val;
        set_paid_invoice(paid_invoice)
        console.log(paid_invoice)
    }

    const edit_invoice_to_paid_state = (val) => {
        edit_paid_invoice = val;
        set_edit_paid_invoice(edit_paid_invoice);
    }

    /* Open Edit Invoice Modal */
    const open_edit_inv_modal = (selected_invoice_data) => {

        edit_invoice_data.edit_invoice_amount = selected_invoice_data.invoice_amount;
        edit_invoice_data.supplier_amount = selected_invoice_data.supplier_amount;
        edit_invoice_data.edit_old_invoice_amount = selected_invoice_data.invoice_amount;
        edit_invoice_data.edit_invoice_number = selected_invoice_data.invoice_number;
        edit_invoice_data.supplier_id = selected_invoice_data.supplier_id;
        edit_invoice_data.store_id = selected_invoice_data.store_id;

        let date = selected_invoice_data.invoice_date;
        let new_edit_date_format = new Date(date.split("/").reverse().join("-"));
        set_edit_invoice_date(new_edit_date_format);


        set_edit_invoice_data(edit_invoice_data);
        edit_invoice_data.invoice_id = selected_invoice_data.invoice_id;
        set_selected_edit_store_invoice({ 'label': selected_invoice_data.store_name, 'value': selected_invoice_data.store_name, 'store_id': selected_invoice_data.store_id });
        set_selected_edit_supplier_invoice({ 'label': selected_invoice_data.supplier_name, 'value': selected_invoice_data.supplier_name, 'store_id': selected_invoice_data.supplier_id });
        set_is_open_edit_invoice_modal(true);
    }

    /* Update Invoice */
    const update_invoice = (selected_row) => {
        var temp_edit_invoice_date = moment(new Date(edit_invoice_date));
        temp_edit_invoice_date = temp_edit_invoice_date.format("dd/MM/yyyy, h:mm:ss a");
        edit_invoice_data.edit_invoice_date = edit_invoice_date;
        set_edit_invoice_data(edit_invoice_data);
        if (edit_invoice_data.edit_invoice_amount < 0) {
            Swal.fire({
                title: 'Invoice amount can not be less than 0',
                text: 'Invoice amount can not be less than 0',
                icon: 'warning',
                confirmButtonText: 'OK'
            })
        } else {
            set_show_submit_invoice_loader(true);
            axios.post(Global_services.update_invoice, edit_invoice_data).then(
                response => {
                    if (response.data == 'DUPLICATE_INV_NUM') {
                        Swal.fire({
                            icon: 'info',
                            title: new_invoice_data.invoice_number,
                            text: 'Le numéro de facture est utilisé dans une autre facture',
                            showConfirmButton: true,
                            // timer: 1000
                        });
                    } else {
                        createNotification('success', 'updated');
                        close_edit_invoice_modal();
                        get_invoices();
                        set_popup_menu({ popup: { visible: false } });
                    }

                    set_show_submit_invoice_loader(false);
                }, error => {
                    set_show_submit_invoice_loader(false);
                    console.log(error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Veuillez contacter votre développeur de logiciel',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
            )
        }
    }

    /* START - Popup Menu functionalities */
    const [popup_menu, set_popup_menu] = useState({
        popup: {
            visible: false,
            x: 0,
            y: 0
        }
    });

    const [selected_row, set_selected_row] = useState({
        rowId: ''
    });
    /* Highllight selected row  */
    var setRowClassName = (record) => {
        return record.invoice_id === selected_row.rowId && record.is_paid == 1 && record.invoice_order == 0 ? 'is_paid-invoice-selected' : record.invoice_id === selected_row.rowId && record.invoice_order == '0' ? 'selected-row' : record.supplier_id === selected_row.rowId && record.invoice_order == '1' ? 'selected-important-row' : record.invoice_order == '1' ? 'important-row' : record.is_paid == 1 && record.invoice_order == 0 ? 'is_paid-invoice' : '';
    };
    /* Context - Menu */
    const onRow = record => ({
        onClick: () => {
            set_popup_menu({ popup: { visible: false } });
            set_selected_row({ rowId: record.invoice_id });
        },
        onContextMenu: event => {
            event.preventDefault();
            set_selected_row({ rowId: record.invoice_id });
            set_popup_menu({
                popup: {
                    record,
                    pin_invoice,
                    un_pin_invoice,
                    delete_invoice,
                    open_edit_inv_modal,
                    pay_invoice,
                    pay_partial_invoice_amount,
                    visible: true,
                    x: event.clientX,
                    y: event.clientY
                }
            });
        }
    });
    /* END - Popup Menu functionalities */

    /* Pay a partial amount from the invoice */
    const pay_partial_invoice_amount = (selected_invoice) => {
        Swal.fire({
            title: 'Montant',
            input: 'number',
            showCancelButton: true,
            confirmButtonText: 'Payez maintenant',
            showLoaderOnConfirm: true,
            preConfirm: (amount_to_pay) => {
                set_show_main_loader(true);
                let calc_total_invoice_amount = parseInt(amount_to_pay) + parseInt(selected_invoice.amount_paid);
                amount_to_pay = parseInt(amount_to_pay)
                if ((amount_to_pay >= selected_invoice.invoice_amount) || (calc_total_invoice_amount >= selected_invoice.invoice_amount)) {
                    Swal.fire({
                        title: 'Sélectionnez une valeur inférieure',
                    })
                    set_show_main_loader(false);
                } else {
                    selected_invoice.amount_to_pay = amount_to_pay
                    axios.post(Global_services.pay_partial_invoice_amount, selected_invoice)
                        .then(response => {
                            Swal.fire({
                                title: 'Réussi',
                            })
                            set_popup_menu({ popup: { visible: false } });
                            get_invoices();
                            set_show_main_loader(false);
                        },
                            error => {
                                set_show_main_loader(false);
                                Swal.fire({
                                    title: 'Veuillez contacter votre développeur de logiciel',
                                })
                            })
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    /* DELETE Invoice */
    const delete_invoice = (selected_invoice) => {
        Swal.fire({
            title: 'Supprimer la facture',
            text: "Voulez-vous vraiment supprimer la facture?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                set_popup_menu({ popup: { visible: false } });
                if (selected_invoice.check_id != null || selected_invoice.amount_paid > 0) {
                    let title = '';
                    let msg = '';
                    if (selected_invoice.check_id != null) {
                        title = 'La facture est affectée à un chèque';
                        msg = 'Impossible de supprimer la facture affectée à un chèque';
                    }
                    if (selected_invoice.amount_paid > 0) {
                        title = 'Une partie de la facture est payée';
                        msg = 'Impossible de supprimer une facture partiellement payée';
                    }
                    Swal.fire({
                        title: title,
                        text: msg,
                        icon: 'info',
                        confirmButtonText: 'OK'
                    })
                } else {
                    set_show_main_loader(true);
                    axios.post(Global_services.delete_invoice, selected_invoice).then(
                        response => {
                            if (response.data == 'INVOICE_IS_ASSIGNED_TO_A_CHECK') {
                                Swal.fire({
                                    title: 'La facture est affectée à un chèque',
                                    text: 'Impossible de supprimer la facture affectée à un chèque',
                                    icon: 'info',
                                    confirmButtonText: 'OK'
                                })
                            } else {
                                Swal.fire({
                                    title: 'Supprimé',
                                    text: 'Supprimé avec succès',
                                    icon: 'success',
                                    showConfirmButton: false,
                                    timer: 1000
                                })
                                get_invoices();
                            }
                            set_show_main_loader(false);
                        }, error => {
                            console.log(error);
                            set_show_main_loader(false);
                            Swal.fire({
                                title: 'Error!',
                                text: 'Veuillez contacter votre développeur de logiciel',
                                icon: 'error',
                                confirmButtonText: 'OK'
                            })
                        }
                    )
                }
            }
        })
    }
    const [pin_unpin_loader, set_pin_unpin_loader] = useState(false);
    /* Pin Invoice */
    const pin_invoice = (pin_invoice) => {
        console.log('pin_invoice')
        console.log(pin_invoice)
        set_pin_unpin_loader(true);
        axios.post(Global_services.pin_invoice, pin_invoice).then(
            response => {
                set_pin_unpin_loader(false)
                createNotification('success', 'To the top of list');
                get_invoices();
                set_popup_menu({ popup: { visible: false } });
            }, error => {
                set_pin_unpin_loader(false)
                console.log(error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Veuillez contacter votre développeur de logiciel',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        )
    }
    /* Unpin Invoice */
    const un_pin_invoice = (pin_invoice) => {
        set_pin_unpin_loader(true);
        axios.post(Global_services.un_pin_invoice, pin_invoice).then(
            response => {
                set_pin_unpin_loader(false);
                createNotification('success', 'Removed');
                get_invoices();
                set_popup_menu({ popup: { visible: false } });
            }, error => {
                set_pin_unpin_loader(false);
                console.log(error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Veuillez contacter votre développeur de logiciel',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        )
    }

    /* Invoice Global Search */
    const [search_invoice_number, set_search_invoice_number] = useState({
        invoice_number: ''
    });
    const handle_search_invoice = (e) => {
        let value = e.target.value;
        let name = e.target.name;
        search_invoice_number[name] = value;
        set_search_invoice_number(search_invoice_number);
    }
    const submit_search_invoice = () => {
        set_show_main_loader(true);
        axios.post(Global_services.search_invoice_number, search_invoice_number).then(
            response => {
                // if(response.data.length > 0){
                assign_response_to_invoice_list(response);
                // }else{
                set_show_main_loader(false);
                // }
            }, error => {
                set_show_main_loader(false);
                console.log(error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Veuillez contacter votre développeur de logiciel',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        )
    }
    return (
        <div className='supplier-view' id='body'>
            {
                pin_unpin_loader ?
                    <div class='table-col-loader'>
                        {Global_services.show_spinner('border', 8, 'primary')}
                    </div>
                    : ''
            }
            <div>
                {
                    // all_stores.length > 0 ?
                    <Common_filter view='invoice' show_loader={set_show_main_loader} response_data={assign_response_to_invoice_list} supplier_list={supplier_list} all_stores={all_stores} />
                    // :
                    // Global_services.show_spinner('border',8,'primary')
                }
            </div>
            <Row>
                <Col>
                    <input onClick={open_new_inv_modal} type='submit' value='Nouvelle facture' className='btn btn-primary add-supp-btn' />
                </Col>
                <Col className='search-invoice'>
                    <Row>
                        <Col>
                            <input type='text' onChange={handle_search_invoice} name='invoice_number' className='form-control' placeholder='Numéro de facture' />
                        </Col>
                        <Col>
                            <input type='submit' value='Chercher' onClick={submit_search_invoice} className='form-control btn btn-primary' />
                        </Col>
                    </Row>
                </Col>
            </Row>
            {
                show_main_loader != true ?
                    <div>
                        <Table bordered
                            columns={columns}
                            dataSource={invoices_list}
                            onRow={onRow}
                            rowClassName={setRowClassName} />
                        <Popup {...popup_menu.popup} />
                    </div>
                    :
                    Global_services.show_spinner('border', 5, 'primary')
            }
            {/* *****************  START - MODALS *********************************  */}
            <Modal show={is_open_new_inv_modal} onHide={close_new_inv_modal}>
                <ModalHeader>
                    <ModalTitle>Ajouter une nouvelle facture</ModalTitle>
                </ModalHeader>
                <ModalBody>

                    <div className='store-form'>
                        <div className="form-group">
                            <label className='input-label'>Nom du magasin</label>
                            <Select
                                placeholder='Select Store'
                                value={selected_store_invoice}
                                onChange={handle_select_store}
                                options={all_stores}
                                name='store_data'
                            />
                        </div>
                        <div className="form-group">
                            <label className='input-label'>Nom du fournisseur</label>
                            <Select
                                placeholder='Select Supplier'
                                value={selected_supplier_invoice}
                                onChange={handle_select_supplier}
                                options={supplier_list}
                                name='store_data'
                            />
                        </div>
                        <div className="form-group">
                            <label className='input-label'>Numéro de facture</label>
                            <input name='invoice_number' autoComplete="off" onChange={handle_new_invoice} value={new_invoice_data.invoice_number} type="number" className="form-control" placeholder="Invoice Number" />
                        </div>
                        <div className='form-group row'>
                            <div className="col-md-6">
                                <label className='input-label'>Montant de la facture</label>
                                <input name='invoice_amount' onChange={handle_new_invoice} value={new_invoice_data.invoice_amount} type="text" className="form-control" placeholder="Invoice Amount" />
                            </div>
                            <div className="col-md-6">
                                <label className='input-label'>Date de la facture</label>
                                <DatePicker dateFormat="dd/MM/yyyy" className='form-control' selected={invoice_date} onChange={date => set_invoice_date(date)} />
                            </div>
                            <div>
                                {/* <input
                                    type="checkbox"
                                    checked={paid_invoice}
                                    onChange={e => set_invoice_paid(e.target.checked)}
                                /> */}
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {
                        show_submit_invoice_loader ?
                            Global_services.show_spinner('grow', 3, 'success')
                            :
                            <button onClick={add_new_invoice} className="btn btn-success">Soumettre</button>

                    }

                    <button onClick={close_new_inv_modal} className="btn btn-danger">Annuler</button>
                </ModalFooter>
            </Modal>

            <Modal show={is_open_edit_invoice_modal} onHide={close_edit_invoice_modal}>
                <ModalHeader>
                    <ModalTitle>Edit Invoice</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <div className='store-form'>
                        <div className="form-group">
                            <label className='input-label'>Supplier Name</label>
                            <Select
                                placeholder='Select Store'
                                value={selected_edit_store_invoice}
                                onChange={handle_edit_select_store}
                                options={all_stores}
                                isDisabled
                            />
                        </div>
                        <div className="form-group">
                            <label className='input-label'>Store Name</label>
                            <Select
                                placeholder='Select Supplier'
                                value={selected_edit_supplier_invoice}
                                onChange={handle_edit_select_supplier}
                                options={supplier_list}
                                isDisabled
                            />
                        </div>
                        <div className="form-group">
                            <label className='input-label'>Invoice Number</label>
                            <input name='edit_invoice_number' onChange={handle_edit_invoice} value={edit_invoice_data.edit_invoice_number} type="number" className="form-control" placeholder="Invoice Number" />
                        </div>
                        <div className='form-group row'>
                            <div className="col-md-6">
                                <label className='input-label'>Invoice Amount</label>
                                <input name='edit_invoice_amount' onChange={handle_edit_invoice} value={edit_invoice_data.edit_invoice_amount} type="number" className="form-control" placeholder="Invoice Amount" disabled />
                            </div>
                            <div className="col-md-6">
                                <label className='input-label'>Invoice Date</label>
                                <DatePicker dateFormat="dd/MM/yyyy" className='form-control' selected={edit_invoice_date} onChange={date => set_edit_invoice_date(date)} />
                            </div>

                            <div>
                                {/* <input
                                    type="checkbox"
                                    checked={edit_paid_invoice}
                                    onChange={e => edit_invoice_to_paid_state(e.target.checked)}
                                /> */}
                            </div>

                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {
                        show_submit_invoice_loader ?
                            Global_services.show_spinner('grow', 3, 'success')
                            :
                            <button onClick={update_invoice} className="btn btn-success">Soumettre</button>
                    }
                    <button onClick={close_edit_invoice_modal} className="btn btn-danger">Annuler</button>
                </ModalFooter>
            </Modal>
            <NotificationContainer />
        </div>
    )
}
export default Invoice;