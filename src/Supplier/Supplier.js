import React, { useEffect,useState } from 'react';
import './Supplier.css';
import Modal from "react-bootstrap/Modal";
import Common_filter from'../Common_filter/Common_filter';
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
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { Table } from "antd";
import 'react-notifications/lib/notifications.css';
import Global_services from '../Global_services/Global_services';
function Supplier(){

    useEffect(()=>{
        get_suppliers();
    },[]);
    
    /* Get all suppliers */
    const [supplier_list,set_supplier_list] = useState([]);
    const get_suppliers= () => {
        set_show_main_loader(true);
        axios.get(Global_services.get_suppliers).then(
            response => {
                assign_response_to_supplier_list(response)
                set_show_main_loader(false);
            },error =>{
                set_show_main_loader(false);
                console.log(error);
            }
        )
    };

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
    /* Open new Sup Modal */
    const [is_open_sup_modal,set_is_open_sup_modal] = useState(false);
    const open_sup_modal = () => {set_is_open_sup_modal(true); 
    set_popup_menu({ popup: { visible: false } });}

    /* Close new Sup Modal */
    const close_sup_modal = () => {set_is_open_sup_modal(false);}

    /* Handle new supplier data */
    const [new_sup_data,set_new_sup_data] = useState({
        supplier_name:'',
        supplier_amount:''
    })
    const handle_new_sup_data = (e) => {
        set_new_sup_data({ ...new_sup_data, [e.target.name]: e.target.value });
    }
    /* Add New supplier */
    const add_new_supplier = () => {
        if(new_sup_data.supplier_name != ''){
            set_submit_sup_loader(true);
            axios.post(Global_services.add_new_supplier,new_sup_data).then(
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
                        supplier_name:'',
                        supplier_amount:''
                    })
                },error =>{
                    set_submit_sup_loader(false);
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
            supplier_name:'',
            supplier_amount:0
        })
        
        console.log(new_sup_data)
    }
    /*  Open Edit Sup Modal */
    const [is_open_edit_sup_modal,set_is_open_edit_sup_modal] = useState(false);
    const open_edit_sup_modal = (selected_supplier) => {
        set_is_open_edit_sup_modal(true);
        set_edit_sup_data({
        edit_supplier_name:selected_supplier.supplier_name,
        edit_supplier_amount:selected_supplier.supplier_amount,
        supplier_id:selected_supplier.supplier_id
        })
        set_popup_menu({ popup: { visible: false } });
        set_submit_sup_loader(false);
    }
    /*  Close Edit Sup Modal */
    const close_edit_sup_modal = () => {set_is_open_edit_sup_modal(false);}
    /* Handle Edit supplier data */
    const [edit_sup_data,set_edit_sup_data] = useState({
        edit_supplier_name:'',
        edit_supplier_amount:'',
        supplier_id:''
    })
    const handle_edit_sup_data = (e) => {
        set_edit_sup_data({ ...edit_sup_data, [e.target.name]: e.target.value });
    }
    /* Submit Edit supplier data */
    const update_supplier_data = () => {
        set_submit_sup_loader(true);
        if(edit_sup_data.supplier_name != ''){
            axios.post(Global_services.update_supplier,edit_sup_data).then(
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
                        supplier_name:'',
                        supplier_amount:''
                    })
                },error =>{
                    console.log(error);
                    set_submit_sup_loader(false);
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
    const [selected_row,set_selected_row] = useState({
        rowId:''
    })
    var setRowClassName = (record) => {
        return record.supplier_id === selected_row.rowId && record.sup_order === '0'? 'selected-row' : record.supplier_id === selected_row.rowId && record.sup_order ==='1' ? 'selected-important-row' :record.sup_order ==='1' ? 'important-row':'';
    }
    const onRow = record => ({
        onClick: () => {
            set_popup_menu({ popup: { visible: false } });
            set_selected_row({rowId:record.supplier_id});
        },
        onContextMenu: event => {
            event.preventDefault();
            set_selected_row({rowId:record.supplier_id});
            set_popup_menu({
                popup: {
                    record,
                    pin_supplier,
                    un_pin_supplier,
                    delete_supplier,
                    open_edit_sup_modal,
                    visible: true,
                    x: event.clientX,
                    y: event.clientY
                }
            });
        }
    });
    /* Popup Menu Methods */
    const delete_supplier = (supplier_data) =>{
        Swal.fire({
            title: 'Action Denied!',
            text: 'Contact your software developer for this action',
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
        //                     text: 'Please Contact your software developer',
        //                     icon: 'error',
        //                     confirmButtonText: 'OK'
        //                 })
        //             }
        //         ) 
        //     }  
        // })
    }
    const [pin_unpin_loader,set_pin_unpin_loader] = useState(false);
    const pin_supplier = (pin_supplier) => {
        set_pin_unpin_loader(true);
        axios.post(Global_services.pin_supplier,pin_supplier).then(
            response => {
                set_pin_unpin_loader(false);
                createNotification('success','To the top of list');
                get_suppliers();
                set_popup_menu({ popup: { visible: false } });
            },error =>{
                set_pin_unpin_loader(false);
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
    const un_pin_supplier = (pin_supplier) => {
        set_pin_unpin_loader(true);
        axios.post(Global_services.un_pin_supplier,pin_supplier).then(
            response => {
                set_pin_unpin_loader(false);
                createNotification('success','Removed');
                get_suppliers();
                set_popup_menu({ popup: { visible: false } });
            },error =>{
                set_pin_unpin_loader(false);
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
    const [submit_sup_loader,set_submit_sup_loader] =  useState(false);
    /* Main table loader */
    const [show_main_loader,set_show_main_loader] = useState(false);
    /* Assign response to supplier list */
    const assign_response_to_supplier_list = (response) => {
        set_supplier_list(response.data);
    }
    return(
        <div className='supplier-view'>
            {
                pin_unpin_loader?
                <div className='table-col-loader'>
                    {Global_services.show_spinner('border',8,'primary')}
                </div>
                :''
            }
            <div>
                <Common_filter view='sup' show_loader={set_show_main_loader} response_data={assign_response_to_supplier_list} supplier_list={supplier_list}/>
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
                    rowClassName={setRowClassName}/>
                    <Popup {...popup_menu.popup}  />
                </div>
                :
                Global_services.show_spinner('border',5,'primary')
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
                            <input onChange={handle_new_sup_data} value={new_sup_data.supplier_name} name='supplier_name' type="text" className="form-control" placeholder="Nom"/>
                        </div>
                        <div className="form-group">
                            <label className='input-label'>Montant initial</label>
                            <input onChange={handle_new_sup_data} value={new_sup_data.supplier_amount} name='supplier_amount' type="text" className="form-control" placeholder="Montant initial"/>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {
                        submit_sup_loader? 
                        Global_services.show_spinner('grow',2,'success')
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
                            <input onChange={handle_edit_sup_data} value={edit_sup_data.edit_supplier_name} name='edit_supplier_name' type="text" className="form-control" placeholder="Name"/>
                        </div>
                        <div className="form-group">
                            <label className='input-label'>Montante</label>
                            <input onChange={handle_edit_sup_data} value={edit_sup_data.edit_supplier_amount} name='edit_supplier_amount' type="text" className="form-control" placeholder="Amount"/>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {
                        submit_sup_loader? 
                        Global_services.show_spinner('grow',2,'success')
                        : 
                        <button onClick={update_supplier_data} className="btn btn-success">Soumettre</button>
                    }
                    <button onClick={close_edit_sup_modal} className="btn btn-danger">Annuler</button>
                </ModalFooter>
            </Modal>
            {/* *****************  END - MODALS *********************************  */}
            <NotificationContainer/>
        </div>
    )
}

export default Supplier;