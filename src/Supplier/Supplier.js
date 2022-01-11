import React, { useEffect, useState } from 'react';
import './Supplier.css';
import Modal from "react-bootstrap/Modal";
import Common_filter from '../Common_filter/Common_filter';
import { columns, data } from "./Supplier_columns";
import Popup from "../Context_menu/Supplier_popup";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
// import Select from 'react-select';
import axios from 'axios';
import Swal from 'sweetalert2';
// import $ from 'jquery';
// import moment from 'moment';
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "antd/dist/antd.css";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Checkbox, Table } from "antd";
import 'react-notifications/lib/notifications.css';
import Global_services from '../Global_services/Global_services';
import CloseIcon from '@mui/icons-material/Close';

function Supplier() {

    useEffect(() => {
        get_suppliers();
        get_all_stores();
    }, []);

    /* Get all suppliers */
    const [supplier_list, set_supplier_list] = useState([]);
    const get_suppliers = () => {
        set_show_main_loader(true);
        axios.get(Global_services.get_suppliers).then(
            response => {
                assign_response_to_supplier_list(response)
                set_show_main_loader(false);
            }, error => {
                set_show_main_loader(false);
                console.log(error);
            }
        )
    };

    /* Get all store to display for partial payment on supplier */
    const [all_stores, set_all_stores] = useState({});
    const [all_stores_arr, set_all_stores_arr] = useState({});
    const get_all_stores = () => {
        axios.get(Global_services.get_stores).then(
            response => {
                let temp_all_stores = {};
                set_all_stores_arr(response.data)
                for (let i = 0; i < response.data.length; i++) {
                    temp_all_stores[response.data[i].store_id] = response.data[i].store_name + ' | ' + response.data[i].drawer_amount;
                }
                set_all_stores(temp_all_stores);
            }, error => {
                console.log(error);
            }
        )
    };

    /* Get payable invoices for the payment */
    const [payable_invoices, set_payable_invoices] = useState([]);
    var [show_payable_invoices_spinner, set_show_payable_invoices_spinner] = useState(false);
    var [default_state_of_payable_invoices_table, set_default_state_of_payable_invoices_table] = useState(false);
    const get_payable_invoices = (record) => {
        set_default_state_of_payable_invoices_table(true);
        set_show_payable_invoices_spinner(true);
        set_popup_menu({ popup: { visible: false } });
        record.store_id = sup_partial_payment_data.store_id;
        axios.post(Global_services.get_unpaid_invoices, record).then(
            response => {
                set_payable_invoices(response.data)
                set_show_payable_invoices_spinner(false);
                // set_default_state_of_payable_invoices_table(true);
            }, error => {
                // set_default_state_of_payable_invoices_table(true);
                console.log(error);
            }
        )
    };

    /* Side Notification */
    function createNotification(type, message) {
        switch (type) {
            case 'info':
                NotificationManager.info('Info', message, 1000);
                break;
            case 'success':
                NotificationManager.success('Success', message, 1000);
                break;
            case 'warning':
                NotificationManager.warning('Warning', message, 1000);
                break;
            case 'error':
                NotificationManager.error('Error', message, 1000, () => {
                    alert('Veuillez contacter votre développeur de logiciel');
                });
                break;
        }

    };
    /* Open new Sup Modal */
    const [is_open_sup_modal, set_is_open_sup_modal] = useState(false);
    const open_sup_modal = () => {
        set_is_open_sup_modal(true);
        set_popup_menu({ popup: { visible: false } });
    }

    /* Close new Sup Modal */
    const close_sup_modal = () => { set_is_open_sup_modal(false); }

    /* Handle new supplier data */
    const [new_sup_data, set_new_sup_data] = useState({
        supplier_name: '',
        supplier_amount: ''
    })
    const handle_new_sup_data = (e) => {
        set_new_sup_data({ ...new_sup_data, [e.target.name]: e.target.value });
    }
    /* Add New supplier */
    const add_new_supplier = () => {
        if (new_sup_data.supplier_name != '') {
            set_submit_sup_loader(true);
            axios.post(Global_services.add_new_supplier, new_sup_data).then(
                response => {
                    set_submit_sup_loader(false);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        showConfirmButton: false,
                        timer: 1000
                    });
                    close_sup_modal();
                    get_suppliers();
                    set_new_sup_data({
                        supplier_name: '',
                        supplier_amount: ''
                    })
                }, error => {
                    set_submit_sup_loader(false);
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
            Swal.fire({
                title: 'Supplier Name is not filled up!',
                text: 'Please fill all required fields',
                icon: 'info',
                confirmButtonText: 'OK'
            })
        }
    }
    /* Rest new Supplier Form */
    const reset_sup_state = () => {
        set_new_sup_data({
            supplier_name: '',
            supplier_amount: 0
        })

        console.log(new_sup_data)
    }
    /*  Open Edit Sup Modal */
    const [is_open_edit_sup_modal, set_is_open_edit_sup_modal] = useState(false);
    const open_edit_sup_modal = (selected_supplier) => {
        set_is_open_edit_sup_modal(true);
        set_edit_sup_data({
            edit_supplier_name: selected_supplier.supplier_name,
            edit_supplier_amount: selected_supplier.supplier_amount,
            supplier_id: selected_supplier.supplier_id
        })
        set_popup_menu({ popup: { visible: false } });
        set_submit_sup_loader(false);
    }
    /*  Close Edit Sup Modal */
    const close_edit_sup_modal = () => { set_is_open_edit_sup_modal(false); }
    /* Handle Edit supplier data */
    const [edit_sup_data, set_edit_sup_data] = useState({
        edit_supplier_name: '',
        edit_supplier_amount: '',
        supplier_id: ''
    })

    const handle_edit_sup_data = (e) => {
        set_edit_sup_data({ ...edit_sup_data, [e.target.name]: e.target.value });
    }

    /* Submit Edit supplier data */
    const update_supplier_data = () => {
        set_submit_sup_loader(true);
        if (edit_sup_data.supplier_name != '') {
            axios.post(Global_services.update_supplier, edit_sup_data).then(
                response => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        showConfirmButton: false,
                        timer: 1000
                    });
                    set_submit_sup_loader(false);
                    close_edit_sup_modal();
                    get_suppliers();
                    set_new_sup_data({
                        supplier_name: '',
                        supplier_amount: ''
                    })
                }, error => {
                    console.log(error);
                    set_submit_sup_loader(false);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Veuillez contacter votre développeur de logiciel',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
            )
        } else {
            Swal.fire({
                title: 'Supplier Name is not filled up!',
                text: 'Please fill all required fields',
                icon: 'info',
                confirmButtonText: 'OK'
            })
        }
    }

    /* Popup Menu functionalities */
    const [popup_menu, set_popup_menu] = useState({
        popup: {
            visible: false,
            x: 0,
            y: 0
        }
    });

    const [selected_row, set_selected_row] = useState({
        rowId: ''
    })
    var setRowClassName = (record) => {
        return record.supplier_id === selected_row.rowId && record.sup_order === '0' ? 'selected-row' : record.supplier_id === selected_row.rowId && record.sup_order === '1' ? 'selected-important-row' : record.sup_order === '1' ? 'important-row' : '';
    }

    const onRow = record => ({
        onClick: () => {
            set_popup_menu({ popup: { visible: false } });
            set_selected_row({ rowId: record.supplier_id });
        },
        onContextMenu: event => {
            event.preventDefault();
            set_selected_row({ rowId: record.supplier_id });
            set_popup_menu({
                popup: {
                    record,
                    pin_supplier,
                    un_pin_supplier,
                    delete_supplier,
                    open_edit_sup_modal,
                    setup_partial_amount_payment,
                    visible: true,
                    x: event.clientX,
                    y: event.clientY
                }
            });
        }
    });
    /* Popup Menu Methods */
    const delete_supplier = (supplier_data) => {
        Swal.fire({
            title: 'Action refusée!',
            text: 'Veuillez contacter votre développeur de logiciel',
            icon: 'info',
            showConfirmButton: true,
        })
        // Swal.fire({
        //     title: 'Delete Supplier',
        //     text: "Are you sure you want to delete supplier?",
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#3085d6',
        //     cancelButtonColor: '#d33',
        //     confirmButtonText: 'Yes, delete it!'
        // }).then((result) => {
        //     set_show_main_loader(true);
        //     set_popup_menu({ popup: { visible: false } });
        //     if (result.value) {
        //         axios.post(Global_services.delete_supplier,supplier_data).then(
        //             response => {
        //                 Swal.fire({
        //                     title: 'Deleted',
        //                     text: 'Successfully Deleted',
        //                     icon: 'success',
        //                     showConfirmButton: false,
        //                     timer: 1000
        //                 })
        //                 get_suppliers();
        //                 set_show_main_loader(false);
        //             },error =>{
        //                 set_show_main_loader(false);
        //                 console.log(error);
        //                 Swal.fire({
        //                     title: 'Error!',
        //                     text: 'Veuillez contacter votre développeur de logiciel',
        //                     icon: 'error',
        //                     confirmButtonText: 'OK'
        //                 })
        //             }
        //         ) 
        //     }  
        // })
    }
    const [pin_unpin_loader, set_pin_unpin_loader] = useState(false);
    const pin_supplier = (pin_supplier) => {
        set_pin_unpin_loader(true);
        axios.post(Global_services.pin_supplier, pin_supplier).then(
            response => {
                set_pin_unpin_loader(false);
                createNotification('success', 'To the top of list');
                get_suppliers();
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
    const un_pin_supplier = (pin_supplier) => {
        set_pin_unpin_loader(true);
        axios.post(Global_services.un_pin_supplier, pin_supplier).then(
            response => {
                set_pin_unpin_loader(false);
                createNotification('success', 'Removed');
                get_suppliers();
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
    const [submit_sup_loader, set_submit_sup_loader] = useState(false);
    /* Main table loader */
    const [show_main_loader, set_show_main_loader] = useState(false);
    /* Assign response to supplier list */
    const assign_response_to_supplier_list = (response) => {
        set_supplier_list(response.data);
    }

    /* START -  Pay on select - NOT USED - Feature changed to multiple selections */
    const [selected_payable_invoice_row, set_selected_payable_invoice_row] = useState(null);
    var handleSelectInvoice = (record) => {
        set_selected_payable_invoice_row(record.invoice_id);
        record.amount_to_pay = amount_to_pay;
        setTimeout(() => {
            Swal.fire({
                title: 'Es-tu sûr?',
                text: "Vous paierez " + amount_to_pay + ' du montant de la facture ' + record.invoice_amount,
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui, payer'
            }).then((result) => {
                set_popup_menu({ popup: { visible: false } });
                if (result.value) {
                    axios.post(Global_services.pay_partial_invoice_amount, record).then(
                        response => {
                            Swal.fire({
                                title: 'Succès',
                                text: '',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1000
                            })
                            get_suppliers();
                            get_payable_invoices(record);
                            set_popup_menu({ popup: { visible: false } });
                            close_payable_invoice_popup();
                        }, error => {
                            set_popup_menu({ popup: { visible: false } });
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
            })
        }, 100);
    }
    /* END -  Pay on select - NOT USED - Feature changed to multiple selections */


    const [amount_to_pay, set_amount_to_pay] = useState(0);
    /* Select store to make the partial payment */

    var setup_partial_amount_payment = (record) => {
        Swal.fire({
            title: 'Montant',
            input: 'number',
            showCancelButton: true,
            confirmButtonText: 'Payez maintenant',
            showLoaderOnConfirm: true,
            preConfirm: (amount_to_pay) => {
                // set_show_main_loader(true);
                set_amount_to_pay(amount_to_pay);

                /* SELECT STORE */
                Swal.fire({
                    input: 'select',
                    inputOptions: all_stores,
                    inputPlaceholder: 'Sélectionnez un magasin',
                    showCancelButton: true,
                    confirmButtonText: 'Payez maintenant',
                    showLoaderOnConfirm: true,
                    inputValidator: (selected_store_id) => {
                        return new Promise((resolve) => {
                            if (selected_store_id != '') {
                                sup_partial_payment_data.store_id = selected_store_id;
                                for (let i = 0; i < all_stores_arr.length; i++) {
                                    if (all_stores_arr[i].store_id == selected_store_id) {

                                        sup_partial_payment_data.drawer_amount = all_stores_arr[i].drawer_amount;

                                    }
                                }
                                get_payable_invoices(record);
                                resolve()
                            } else {
                                resolve('Veuillez sélectionner un magasin')
                            }
                        })
                    },
                    allowOutsideClick: () => !Swal.isLoading()
                })
            },
            allowOutsideClick: () => !Swal.isLoading()
        })

    }

    /* select /  deselect an invoice  */
    const removeFromArray = (arr, num) => arr.filter(el => el !== num);
    /* Handle payment for multiple invoices selections */
    var [selected_payable_invoices_ids, set_selected_payable_invoices_ids] = useState([]);
    var [total_selected_invoices_amount, set_total_selected_invoices_amount] = useState(0);
    var [sup_partial_payment_data, set_sup_partial_payment_data] = useState(
        {
            "invoice_ids": "",
            "partially_paid_invoice_id": -1,
            "supplier_amount": '',
            "total_invoices_amount": '',
            "supplier_id": '',
            "store_id": '',
            "drawer_amount": ''
        });

    var handle_multiple_invoices_selections = (record) => {

        if (!selected_payable_invoices_ids.includes(record.invoice_id)) {

            /* if selected invoice has partial payment then add the remain amount only to the total_selected_invoices_amount */
            if (record.amount_paid > 0) {
                // let remain_selected_invoice_amount = record.invoice_amount - record.amount_paid;
                // if (total_selected_invoices_amount + remain_selected_invoice_amount > amount_to_pay) {
                //     sup_partial_payment_data.partially_paid_invoice_id = record.invoice_id;
                    

                // } else {
                //     total_selected_invoices_amount = total_selected_invoices_amount + (record.invoice_amount - record.amount_paid);
                // }
                total_selected_invoices_amount = total_selected_invoices_amount + (record.invoice_amount - record.amount_paid);
            } else {
                total_selected_invoices_amount = total_selected_invoices_amount + record.invoice_amount;
            }
            selected_payable_invoices_ids.push(record.invoice_id);

        } else {
            if (record.amount_paid > 0) {
                total_selected_invoices_amount = total_selected_invoices_amount - (record.invoice_amount - record.amount_paid);
            } else {

                total_selected_invoices_amount = total_selected_invoices_amount - record.invoice_amount;
            }
            selected_payable_invoices_ids = removeFromArray(selected_payable_invoices_ids, record.invoice_id);
        }
        sup_partial_payment_data.supplier_amount = record.supplier_amount;
        sup_partial_payment_data.supplier_id = record.supplier_id;

        set_selected_payable_invoices_ids(selected_payable_invoices_ids);
        set_total_selected_invoices_amount(total_selected_invoices_amount)
    }

    const pay_selected_invoices = () => {
        sup_partial_payment_data.invoice_ids = selected_payable_invoices_ids;
        sup_partial_payment_data.total_invoices_amount = total_selected_invoices_amount;
        set_sup_partial_payment_data(sup_partial_payment_data);
        setTimeout(() => {
            Swal.fire({
                title: 'Es-tu sûr?',
                text: "Vous paierez " + total_selected_invoices_amount + ' du montant de la facture ' + sup_partial_payment_data.supplier_amount,
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui, payer'
            }).then((result) => {
                set_popup_menu({ popup: { visible: false } });
                if (result.value) {
                    axios.post(Global_services.pay_selected_sup_invoices, sup_partial_payment_data).then(
                        response => {
                            Swal.fire({
                                title: 'Succès',
                                text: '',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1000
                            })
                            get_suppliers();
                            get_all_stores()
                            close_payable_invoice_popup();
                        }, error => {
                            set_popup_menu({ popup: { visible: false } });
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
            })
        }, 100);
    }

    const close_payable_invoice_popup = () => {
        set_default_state_of_payable_invoices_table(false);
        set_selected_payable_invoices_ids([]);
        set_total_selected_invoices_amount(0)
        set_popup_menu({ popup: { visible: false } });
        setTimeout(() => {

            set_sup_partial_payment_data(({ "invoice_ids": "", "partially_paid_invoice_id": -1, "supplier_amount": '', "total_invoices_amount": '', "supplier_id": '', "store_id": '', "drawer_amount": '' }))
        }, 300);
    }

    return (
        <div className='supplier-view'>
            {
                default_state_of_payable_invoices_table == true ?
                    <div className='hidden-supplier-invoice-dialog'>
                        <div className='sup-total-selected-invoices-amount'> {amount_to_pay} / Montant:  <span className='pay-selected-invoices btn btn-success' onClick={pay_selected_invoices}>{total_selected_invoices_amount}  </span></div>
                        <div onClick={close_payable_invoice_popup} className='close-payable-invoice-popup'><CloseIcon></CloseIcon></div>
                        <table className='table table-bordered table-striped text-center'>
                            <thead>
                                <tr>
                                    <td>ID</td>
                                    <td>Date de création</td>
                                    <td>Numéro de facture</td>
                                    <td>Montant</td>
                                    <td>Le montant payé</td>
                                </tr>
                            </thead>
                            {
                                show_payable_invoices_spinner === true ?
                                    <div className='payable-invoices-spinner'>
                                        {Global_services.show_sub_spinner('grow', 8, 'primary')}
                                    </div>
                                    :
                                    <tbody>
                                        {
                                            payable_invoices.map((el, index) => {
                                                return <tr onClick={() => handle_multiple_invoices_selections(el)} key={el.invoice_id} Style={selected_payable_invoices_ids.includes(el.invoice_id) ? 'background-color:lightblue;color:black;box-shadow: black 0px 0px 10px 0px;' : 'color:black'} >
                                                    <td>{el.invoice_id}</td>
                                                    <td>{el.invoice_date}</td>
                                                    <td>{el.invoice_number}</td>
                                                    <td>{el.invoice_amount}</td>
                                                    <td>{el.amount_paid}</td>
                                                </tr>
                                            })
                                        }
                                        {
                                            payable_invoices.length === 0 ?
                                                <span className='no-payable-invoices'> Pas de données </span>
                                                :
                                                ''
                                        }
                                    </tbody>
                            }
                        </table>
                    </div>
                    :
                    ''
            }
            {
                pin_unpin_loader ?
                    <div className='table-col-loader'>
                        {Global_services.show_spinner('border', 8, 'primary')}
                    </div>
                    : ''
            }
            <div>
                <Common_filter view='sup' show_loader={set_show_main_loader} response_data={assign_response_to_supplier_list} supplier_list={supplier_list} />
            </div>
            <div>
                <input type='submit' onClick={open_sup_modal} value='Nouveau fournisseur' className='btn btn-primary add-supp-btn' />
            </div>
            {
                !show_main_loader ?

                    <div>
                        <Table bordered
                            columns={columns}
                            dataSource={supplier_list}
                            onRow={onRow}
                            rowClassName={setRowClassName} />
                        <Popup {...popup_menu.popup} />
                    </div>
                    :
                    Global_services.show_spinner('border', 5, 'primary')
            }

            {/* *****************  START - MODALS *********************************  */}
            <Modal show={is_open_sup_modal} onHide={close_sup_modal}>
                <ModalHeader>
                    <ModalTitle>Ajouter un nouveau fournisseur</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <div className='store-form'>
                        <div className="form-group">
                            <label className='input-label'>Nom</label>
                            <input onChange={handle_new_sup_data} value={new_sup_data.supplier_name} name='supplier_name' type="text" className="form-control" placeholder="Nom" />
                        </div>
                        <div className="form-group">
                            <label className='input-label'>Montant initial</label>
                            <input onChange={handle_new_sup_data} value={new_sup_data.supplier_amount} name='supplier_amount' type="text" className="form-control" placeholder="Montant initial" />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {
                        submit_sup_loader ?
                            Global_services.show_spinner('grow', 2, 'success')
                            :
                            <button onClick={add_new_supplier} className="btn btn-success">Soumettre</button>
                    }

                    <button onClick={close_sup_modal} className="btn btn-danger">Annuler</button>
                </ModalFooter>
            </Modal>
            <Modal show={is_open_edit_sup_modal} onHide={close_edit_sup_modal}>
                <ModalHeader>
                    <ModalTitle>Éditer</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <div className='store-form'>
                        <div className="form-group">
                            <label className='input-label'>Nom</label>
                            <input onChange={handle_edit_sup_data} value={edit_sup_data.edit_supplier_name} name='edit_supplier_name' type="text" className="form-control" placeholder="Name" />
                        </div>
                        <div className="form-group">
                            <label className='input-label'>Montante</label>
                            <input onChange={handle_edit_sup_data} value={edit_sup_data.edit_supplier_amount} name='edit_supplier_amount' type="text" className="form-control" placeholder="Amount" />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {
                        submit_sup_loader ?
                            Global_services.show_spinner('grow', 2, 'success')
                            :
                            <button onClick={update_supplier_data} className="btn btn-success">Soumettre</button>
                    }
                    <button onClick={close_edit_sup_modal} className="btn btn-danger">Annuler</button>
                </ModalFooter>
            </Modal>
            {/* *****************  END - MODALS *********************************  */}
            <NotificationContainer />
        </div>
    )
}
export default Supplier;