import React, { useEffect,useState } from 'react';
import './Invoice.css';
import Modal from "react-bootstrap/Modal";
import Common_filter from'../Common_filter/Common_filter';
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
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { Table } from "antd";
import 'react-notifications/lib/notifications.css';

function Invoice () {
    useEffect(()=>{
        get_suppliers();
        get_invoices();
        get_all_stores();
    },[]);

    /* Invoice modal */
    const [is_open_new_inv_modal,set_is_open_new_inv_modal] =useState(false);
    const close_new_inv_modal = () => {set_is_open_new_inv_modal(false);}
    const open_new_inv_modal = () => {set_is_open_new_inv_modal(true);
        set_popup_menu({ popup: { visible: false } });};

    /* Get all stores */
    const [all_stores,set_all_stores]= useState([]);
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

    /* Store SELECT */
    const [selected_store_invoice,set_selected_store_invoice] = useState('');
    const handle_select_store = (_selectedOption) =>{
        set_selected_store_invoice(_selectedOption);
        new_invoice_data.store_id=_selectedOption.store_id;
    }

    /* Get all Suppliers*/
    const [supplier_list,set_supplier_list] = useState(null);
    const get_suppliers= () => {
        axios.get('http://localhost:4000/supplier').then(
            response => {
                var temp_all_stores=[];
                for(var i =0;i<response.data.length;i++){
                    temp_all_stores.push({
                        'value':response.data[i].supplier_name,
                        'label':response.data[i].supplier_name,
                        'supplier_id':response.data[i].supplier_id
                    })
                }
                set_supplier_list(temp_all_stores);
            },error =>{
                console.log(error);
            }
        )
    };
    /* Supplier SELECT */
    const [selected_supplier_invoice,set_selected_supplier_invoice] = useState('');
    const handle_select_supplier = (_selectedOption) =>{
        set_selected_supplier_invoice(_selectedOption);
        new_invoice_data.supplier_id=_selectedOption.supplier_id;
    }

    /* Invoice Date */
    const [invoice_date,set_invoice_date] = useState(new Date());

    /* New Invoice Form */
    const [new_invoice_data,set_new_invoice_data] = useState({
        supplier_id:'',
        store_id:'',
        invoice_number:'',
        invoice_amount:'',
        invoice_date:''
    })

    /* Handle New Invoice data */
    const handle_new_invoice = (e) =>{
        set_new_invoice_data({...new_invoice_data,[e.target.name]:e.target.value})
    }

    /* Submit Invoice */
    const add_new_invoice = () => {
        if(new_invoice_data.supplier_id != '' && new_invoice_data.store_id != '' && new_invoice_data.invoice_amount != '' && new_invoice_data.invoice_number != ''){
            
            var temp_invoice_date=moment(new Date(invoice_date));
            temp_invoice_date=temp_invoice_date.format("dd/MM/yyyy, h:mm:ss a");
            new_invoice_data.invoice_date=invoice_date;
            axios.post('http://localhost:4000/invoice',new_invoice_data).then(
                response => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Added',
                        showConfirmButton: true,
                        // timer: 1000
                    });
                    get_invoices();
                    reset_invoice();
                    set_popup_menu({ popup: { visible: false } });
                },error =>{
                    console.log(error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Please Contact your software developer',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
            )
        }else{
            
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
            supplier_id:'',
            store_id:'',
            invoice_number:'',
            invoice_amount:'',
            invoice_date:''
        })
        set_selected_store_invoice({"label":"","value":"","store_id":""});
        set_selected_supplier_invoice({"label":"","value":"","supplier_id":""});
    }

    /* Get Invoices */
    const [invoices_list,set_invoices_list] =useState([]);
    const get_invoices = function(){
        axios.get('http://localhost:4000/invoice').then(
            response => {
                let invoices=response.data
                invoices.map(el => {
                    let date = moment(new Date(el.invoice_date));
                    el.invoice_date = date.format("DD/MM/YYYY")
                })
                set_invoices_list(invoices);
                
                console.log(invoices_list);
            },error =>{
                console.log(error.data);
            }
        )
    }

    /* Open Invoice Details */
    const open_invoice_details = () => {

    }

    /*Edit Invoice Date */
    const [edit_invoice_date,set_edit_invoice_date] = useState(new Date());
    const [edit_invoice_data,set_edit_invoice_data] = useState({
        invoice_id:'',
        supplier_id:'',
        store_id:'',
        edit_invoice_number:'',
        edit_invoice_amount:'',
        edit_old_invoice_amount:'',
        edit_invoice_date:''
    })

    /* Slide Notification */
    function createNotification(type,message){
        switch (type) {
          case 'info':
            NotificationManager.info('Info', message,1000);
            break;
          case 'success':
            NotificationManager.success('Success', message, 1000);
            break;
          case 'warning':
            NotificationManager.warning('Warning', message, 1000);
            break;
          case 'error':
            NotificationManager.error('Error', message, 1000, () => {
              alert('Please Contact your software developer!');
            });
            break;
        }
      
    };
    /* Handle New Invoice data */
    const handle_edit_invoice = (e) =>{
        set_edit_invoice_data({...edit_invoice_data,[e.target.name]:e.target.value});
    }

    /* Edit Invoice */
    const [is_open_edit_invoice_modal,set_is_open_edit_invoice_modal] = useState(false);
    const close_edit_invoice_modal = () =>{
        set_is_open_edit_invoice_modal(false);
        reset_after_update();
        set_popup_menu({ popup: { visible: false } });
    }
    
    /* EDIT Store SELECT */
    const [selected_edit_store_invoice,set_selected_edit_store_invoice] = useState('');
    const handle_edit_select_store = (_selectedOption) =>{
        set_selected_edit_store_invoice(_selectedOption);
        edit_invoice_data.store_id=_selectedOption.store_id;
    }

    /* EDIT Supplier SELECT */
    const [selected_edit_supplier_invoice,set_selected_edit_supplier_invoice] = useState('');
    const handle_edit_select_supplier = (_selectedOption) =>{
        set_selected_edit_supplier_invoice(_selectedOption);
        edit_invoice_data.supplier_id=_selectedOption.supplier_id;
    }

    /* Reset Invoice after update */
    const reset_after_update = () => {
        set_edit_invoice_data({
            invoice_id:'',
            supplier_id:'',
            store_id:'',
            edit_invoice_number:'',
            edit_invoice_amount:'',
            edit_invoice_date:''
        })
        set_selected_edit_store_invoice({'label':'','value':'','store_id':''});
        set_selected_edit_supplier_invoice({'label':'','value':'','store_id':''});
    }
    /* Open Edit Invoice Modal */
    const open_edit_inv_modal = (selected_invoice_data) =>{
        set_is_open_edit_invoice_modal(true);
        edit_invoice_data.edit_invoice_amount=selected_invoice_data.invoice_amount;
        edit_invoice_data.edit_old_invoice_amount=selected_invoice_data.invoice_amount;
        edit_invoice_data.edit_invoice_number=selected_invoice_data.invoice_number;
        edit_invoice_data.supplier_id=selected_invoice_data.supplier_id;
        edit_invoice_data.store_id=selected_invoice_data.store_id;
        set_edit_invoice_data(edit_invoice_data);
        edit_invoice_data.invoice_id=selected_invoice_data.invoice_id;
        set_selected_edit_store_invoice({'label':selected_invoice_data.store_name,'value':selected_invoice_data.store_name,'store_id':selected_invoice_data.store_id});
        set_selected_edit_supplier_invoice({'label':selected_invoice_data.supplier_name,'value':selected_invoice_data.supplier_name,'store_id':selected_invoice_data.supplier_id});
    }

    /* Update Invoice */
    const update_invoice = () => {
            var temp_edit_invoice_date=moment(new Date(edit_invoice_date));
            temp_edit_invoice_date=temp_edit_invoice_date.format("dd/MM/yyyy, h:mm:ss a");
            edit_invoice_data.edit_invoice_date=edit_invoice_date;
            set_edit_invoice_data(edit_invoice_data);
            console.log(edit_invoice_data.edit_invoice_amount)
        if(edit_invoice_data.edit_invoice_amount < 0){
            Swal.fire({
                title: 'Invoice amount can not be less than 0',
                text: 'Invoice amount can not be less than 0',
                icon: 'warning',
                confirmButtonText: 'OK'
            })
        }else{
            axios.post('http://localhost:4000/update_invoice',edit_invoice_data).then(
                response => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Added',
                        showConfirmButton: false,
                        timer: 1000
                    });
                    close_edit_invoice_modal();
                    get_invoices();
                    set_popup_menu({ popup: { visible: false } });
                },error =>{
                    console.log(error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Please Contact your software developer',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
            )
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

    const [selected_row,set_selected_row] = useState({
        rowId:''
    });

    var setRowClassName = (record) => {
        return record.invoice_id === selected_row.rowId && record.invoice_order=='0'? 'selected-row' : record.supplier_id === selected_row.rowId && record.invoice_order=='1' ? 'selected-important-row' :record.invoice_order=='1' ? 'important-row':'';
    };

    const onRow = record => ({
        onClick: () => {
            set_popup_menu({ popup: { visible: false } });
            set_selected_row({rowId:record.invoice_id});
        },
        onContextMenu: event => {
            event.preventDefault();
            set_selected_row({rowId:record.invoice_id});
            set_popup_menu({
                popup: {
                    record,
                    pin_invoice,
                    un_pin_invoice,
                    delete_invoice,
                    open_edit_inv_modal,
                    open_invoice_details,
                    visible: true,
                    x: event.clientX,
                    y: event.clientY
                }
            });
        }
    });

    /* Update Invoice */
    const delete_invoice = (selected_invoice) => {
        Swal.fire({
            title: 'Delete Invoice',
            text: "Are you sure you want to delete image?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            set_popup_menu({ popup: { visible: false } });
            if (result.value) {
                axios.post('http://localhost:4000/delete_invoice',selected_invoice).then(
                    response => {
                        Swal.fire({
                            title: 'Deleted',
                            text: 'Successfully Deleted',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1000
                        })
                        get_invoices();
                    },error =>{
                        console.log(error);
                        Swal.fire({
                            title: 'Error!',
                            text: 'Please Contact your software developer',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        })
                    }
                ) 
            }  
        })
    }
    
    /* Pin Invoice */
    const pin_invoice = (pin_invoice) => {
        axios.post('http://localhost:4000/pin_invoice',pin_invoice).then(
            response => {
                createNotification('success','To the top of list');
                get_invoices();
                set_popup_menu({ popup: { visible: false } });
            },error =>{
                console.log(error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Please Contact your software developer',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        )
    }
    /* Unpin Invoice */
    const un_pin_invoice = (pin_invoice) => {
        axios.post('http://localhost:4000/un_pin_invoice',pin_invoice).then(
            response => {
                createNotification('success','Removed');
                get_invoices();
                set_popup_menu({ popup: { visible: false } });
            },error =>{
                console.log(error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Please Contact your software developer',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        )
    }
    return (
        <div className='supplier-view'>
            <div>
                <Common_filter />
            </div>
            <div>
                <input onClick={open_new_inv_modal} type='submit' value='New Invoice' className='btn btn-primary add-supp-btn' />
            </div>
            <div>
                <Table bordered
                    columns={columns}
                    dataSource={invoices_list}
                    onRow={onRow}
                    rowClassName={setRowClassName} />
                <Popup {...popup_menu.popup} />
            </div>
            {/* *****************  START - MODALS *********************************  */}
            <Modal show={is_open_new_inv_modal} onHide={close_new_inv_modal}>
                <ModalHeader>
                    <ModalTitle>Add New Invoice</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <div className='store-form'>
                        <div className="form-group">
                            <label className='input-label'>Store Name</label>  
                            <Select
                                placeholder='Select Store'
                                value={selected_store_invoice}
                                onChange={handle_select_store}
                                options={all_stores}
                                name='store_data'
                            />
                        </div>
                        <div className="form-group">
                            <label className='input-label'>Supplier Name</label>  
                            <Select
                                placeholder='Select Supplier'
                                value={selected_supplier_invoice}
                                onChange={handle_select_supplier}
                                options={supplier_list}
                                name='store_data'
                            />
                        </div>
                        <div className="form-group">
                            <label className='input-label'>Invoice Number</label>
                            <input name='invoice_number' onChange={handle_new_invoice} value={new_invoice_data.invoice_number} type="number" className="form-control" placeholder="Invoice Number" />
                        </div>
                        <div className='form-group row'>
                            <div className="col-md-6">
                                <label className='input-label'>Invoice Amount</label>
                                <input name='invoice_amount' onChange={handle_new_invoice} value={new_invoice_data.invoice_amount} type="text" className="form-control" placeholder="Invoice Amount" />
                            </div>
                            <div className="col-md-6">
                                <label className='input-label'>Invoice Date</label>
                                <DatePicker dateFormat="dd/MM/yyyy" className='form-control' selected={invoice_date} onChange={date => set_invoice_date(date)}/>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button onClick={add_new_invoice} className="btn btn-success">Soumettre</button>
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
                                <input name='edit_invoice_amount' onChange={handle_edit_invoice} value={edit_invoice_data.edit_invoice_amount} type="number" className="form-control" placeholder="Invoice Amount" />
                            </div>
                            <div className="col-md-6">
                                <label className='input-label'>Invoice Date</label>
                                <DatePicker dateFormat="dd/MM/yyyy" className='form-control' selected={invoice_date} onChange={date => set_edit_invoice_date(date)}/>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button onClick={update_invoice} className="btn btn-success">Soumettre</button>
                    <button onClick={close_edit_invoice_modal} className="btn btn-danger">Annuler</button>
                </ModalFooter>
            </Modal>
            <NotificationContainer/>
        </div>
    )
}
export default Invoice;