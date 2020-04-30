import React, { useEffect,useState } from 'react';
import './Invoice.css';
import Modal from "react-bootstrap/Modal";
import Common_filter from'../Common_filter/Common_filter';
import { columns, data } from "./Invoice_columns";
// import Popup from "../Context_menu/Supplier_popup";
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
        get_all_stores();
    },[]);
    /* Invoice modal */
    const [is_open_new_inv_modal,set_is_open_new_inv_modal] =useState(false);
    const close_new_inv_modal = () => {set_is_open_new_inv_modal(false);}
    const open_new_inv_modal = () => {set_is_open_new_inv_modal(true)};

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

    /* Store SELECT */
    const [selected_store_invoice,set_selected_store_invoice] = useState('');
    const handle_select_store = (_selectedOption) =>{
        set_selected_store_invoice(_selectedOption)
    }

    /* Supplier SELECT */
    const [selected_supplier_invoice,set_selected_supplier_invoice] = useState('');
    const handle_select_supplier = (_selectedOption) =>{
        set_selected_supplier_invoice(_selectedOption)
    }
    
    return (
        <div className='supplier-view'>
            <div>
                <Common_filter />
            </div>
            <div>
                <input onClick={open_new_inv_modal} type='submit' value='New Invoice' className='btn btn-primary add-supp-btn' />
            </div>
            {/* *****************  START - MODALS *********************************  */}
            <Modal show={is_open_new_inv_modal} onHide={close_new_inv_modal}>
                <ModalHeader>
                    <ModalTitle>Add New Invoice</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <div className='store-form'>
                        <div className="form-group">
                            <label className='input-label'>Supplier Name</label>  
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
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-success">Soumettre</button>
                    <button onClick={close_new_inv_modal} className="btn btn-danger">Annuler</button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
export default Invoice;